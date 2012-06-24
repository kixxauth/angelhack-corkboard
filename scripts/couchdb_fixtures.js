require('coffee-script');

var mFS = require('fs')
  , mPA = require('path')
  , mVM = require('vm')

  , mOP = require('operetta')
  , mUT = require('../lib/utils')
  , CRADLE = require('cradle')

var gProcess = process;
var gOptparser = new mOP.Operetta();

gOptparser.banner = "Setup a CouchDB database with fixures";

gOptparser.parameters(
        ['--dir'],
        "The directory to load fixtures from.");
gOptparser.parameters(
        ['--host'],
        "The hostname of the CouchDB server. The default is 'localhost'.");
gOptparser.parameters(
        ['--port'],
        "The port of the CouchDB server. The default is 5984.");
gOptparser.parameters(
        ['--username'],
        "CouchDB remote username");
gOptparser.parameters(
        ['--password'],
        "CouchDB remote password");
gOptparser.options(
        ['--no-load'],
        "Only delete the existing documents, don't load any new ones.");

function gMain(aOpts) {
    var oDir  = (aOpts['--dir'] || [])[0]
      , oHost = (aOpts['--host'] || [])[0] || 'localhost'
      , oPort = (aOpts['--port'] || [])[0] || 5984
      , oNoLoad = (aOpts['--no-load'] || [])[0] ? true : false
      , oUsername = (aOpts['--username'] || [])[0]
      , oPassword = (aOpts['--password'] || [])[0]
      , connectionSpec, db, dirname 

    if (!oDir) {
        console.error("--dir parameter is required");
        gOptparser.usage();
        gProcess.exit(1);
    }

    connectionSpec = {
        host: oHost
      , port: oPort
    };

    if (oUsername && oPassword) {
        connectionSpec.authentication = {
            username: oUsername
          , password: oPassword
        };
    }

    dirname = mPA.basename(oDir).replace(/\/$/, '');

    db = new CRADLE.Connection().database('corkboard_mobi');
    gDeleteDocuments(db, function () {
        if (oNoLoad) {
            console.log("Done deleting documents. Exiting...");
            process.exit();
        }

        return gLoadDocuments(oDir, gPutDocument(db))
    });

    return;
}

function gDeleteDocuments(aDB, aCallback) {
    function deleteDocs(rows) {
        if (!rows || !rows.length) {
            return aCallback();
        }

        var iCount = rows.length;
        var row;

        for (var i = 0; i < rows.length; i += 1) {
            row = rows[i];
            aDB.remove(row.id, row.value.rev, function (err, res) {
                iCount = iCount - 1;

                if (err) {
                    throw err;
                }

                console.log('     - deleted', row.id);
                if (iCount === 0) {
                    aCallback();
                }
            });
        }
    }

    aDB.get('_all_docs', function (err, res) {
        if (err) {
            throw err;
        }
        return deleteDocs(res);
    });
    return;
}

function gLoadDocuments(aDir, aEmit) {
    var items;

    try {
        items = mFS.readdirSync(aDir);
    } catch (fileErr) {
        console.error("Problem reading fixture directory:");
        throw fileErr
    }

    items.forEach(function (item) {
        var path = mPA.join(aDir, item)
          , stats = mFS.statSync(path)
          , text, doc, sandbox

        if (!stats.isFile()) return;

        try {
            text = mFS.readFileSync(path, 'utf8');
        } catch (readErr) {
            console.error("Problem reading fixture file:");
            throw readErr;
        }

        if (/\.js$/.test(path)) {
            sandbox = {};

            text = gIncludes(text, aDir);

            try {
                mVM.runInNewContext(text, sandbox, path);
            } catch (vmErr) {
                console.error("Problem parsing design fixture");
                throw vmErr;
            }
            doc = sandbox;
            doc._id = '_design/'+ item.replace(/\.js$/, '');
            doc.language = 'javascript';
        } else if (/\.json$/.test(path)) {
            try {
                doc = JSON.parse(text);
            } catch (jsonErr) {
                console.error("Problem parsing fixture JSON, from", item);
                throw jsonErr;
            }
        }
        else {
            console.log(" --- Not loading", item);
            return;
        }

        console.log(" --- Loading", item);
        return aEmit(item, doc);
    });

    if (!items.length) {
        console.log('No document fixtures to load');
        process.exit();
    }

    return;
}

function gPutDocument(aDB) {
    return function (filename, doc) {
        var parts = filename.split('.')
          , id = parts[0]
          , ext = parts[1]

        if (ext === 'js') {
            id = "_design/" + id;
        }

        aDB.save(id, doc, function (err, res) {
            if (err) {
                console.error("Problem PUTing document", id);
                console.log(doc);
                throw err;
            }

            console.log(' --> ', filename, res);
        });
    };

    return;
}

function gIncludes(aText, aDir) {
    var i = 0
      , rx = /^[\s]+\/\/!\s([\.\/\w-]+)/
      , lines = aText.split('\n')
      , buff = []
      , line, text

    for (; i < lines.length; i += 1) {
        line = lines[i];
        match = rx.exec(line);

        if (match) {
            filePath = mPA.resolve(aDir, match[1]);
            try {
                text = mFS.readFileSync(filePath, 'utf8');
            } catch (readErr) {
                console.error("Problem reading lib file:");
                throw readErr;
            }
            buff.push(text);
        } else {
            buff.push(line);
        }
    }

    return buff.join('\n');
}

gOptparser.start(gMain);
