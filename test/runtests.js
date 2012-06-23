var FS = require('fs')
  , PATH = require('path')
  , TRM = require('treadmill')

function checkTestFile(filename) {
    return /^test/.test(filename);
}

function resolvePath(filename) {
    return PATH.join(__dirname, filename);
}

var listing = FS.readdirSync(__dirname);
var filepaths = listing.filter(checkTestFile).map(resolvePath);

TRM.run(filepaths, function (err) {
    if (err) process.exit(2);
    process.exit();
});
