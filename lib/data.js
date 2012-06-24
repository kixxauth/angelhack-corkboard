var Q = require('q')
  , CRADLE = require('cradle')
  , UTIL = require('./utils')

if (typeof DB === 'undefined') {
  DB = new CRADLE.Connection().database('corkboard_mobi');
}

exports.getFeed = function () {
    var deferred = Q.defer()

    DB.view('consumers/all_by_pubdate', function (err, res) {
        if (err) {
            msg = "DB problem getting 'consumers/all_by_pubdate'";
            UTIL.error(err, msg);
            return deferred.reject(err);
        }

        return deferred.resolve(res);
    });

    return deferred.promise;
};

exports.getEvents = function () {
    var deferred = Q.defer()

    DB.view('consumers/events_by_pubdate', function (err, res) {
        if (err) {
            msg = "DB problem getting 'consumers/events_by_pubdate'";
            UTIL.error(err, msg);
            return deferred.reject(err);
        }

        return deferred.resolve(res);
    });

    return deferred.promise;
};
