exports.error = function (err, msg) {
    console.error(msg);
    console.error(err.stack || err.toString());
};
