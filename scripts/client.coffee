Router = Backbone.Router.extend
    routes:
        "/" : "index"
        "/post/:id" : "post_detail"
        "/events" : "events"
        "/event/:id" : "event_detail"
    index : -> 
    post_detail : (id) ->
    events : ->
    event_detail : (id) ->

router = new Router
Backbone.history.start()