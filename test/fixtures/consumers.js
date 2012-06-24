var views = {
    all_by_pubdate: {
        map: function (doc) {
            emit(doc.pubdate, doc);
        }
    }
};
