PATH = require 'path'

SWIG = require 'swig'

EM.endpoint({
    name: 'main'
    route: '/'
    methods: 'GET'
    handler: ->
        abspath = PATH.join(__dirname, 'templates/index.html')
        tmpl = SWIG.compileFile(abspath)
        text = tmpl.render()
        if typeof text isnt 'string'
            text = text.render()
        @respond(200, 'html', text)
        return
})
