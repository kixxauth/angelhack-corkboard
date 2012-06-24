var views = {
    all_by_pubdate: {
        map: function (doc) {
            emit(doc.pubdate, doc);
        }
    },

    events_by_pubdate: {
        map: function (doc) {
            if (doc.type === 'Event') {
                emit(doc.pubdate, doc);
            }
        }
    }
};
