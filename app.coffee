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

        DAT.getFeed().fail(@fail).then (res) =>
            items = res.map (row) ->
                return row

            console.log(items)
            text = tmpl.render({items: items})
            if typeof text isnt 'string'
                text = text.render()
            @respond(200, 'html', text)
            return

        return
})
