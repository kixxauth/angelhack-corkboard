describe('dataFeed', function () {
    var DATA = require('../lib/data')

    it('should return more than 1 result', function (done) {
        this.expectCount(1);
        DATA.getFeed().then(function (res) {
            expect(res.length > 1).toBe(true);
            return done();
        }).fail(function (err) {
            return done(new Error(err.reason));
        });
        return;
    });
});
