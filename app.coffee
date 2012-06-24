PATH = require 'path'

SWIG = require 'swig'

DAT = require './lib/data'

SWIG.init({
    cache: off
    root: PATH.join(__dirname, 'templates')
})

EM.endpoint({
    name: 'main'
    route: '/'
    methods: 'GET'
    handler: ->
        tmpl = SWIG.compileFile('index.html')

        endpoint = @
        DAT.getFeed().fail(@fail).then (res) =>
            items = res.map (row) ->
                return row

            DAT.getEvents().fail(@fail).then (res) =>
                events = res.map (row) ->
                    return row

                text = tmpl.render({items: items, events: events})
                if typeof text isnt 'string'
                    text = text.render()
                endpoint.respond(200, 'html', text)
                return
            return

        return
})
