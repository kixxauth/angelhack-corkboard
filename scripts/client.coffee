class MainTabs
    constructor: ->
        @$streamFeed = $('#stream-feed')
        @$eventsFeed = $('#events-feed')

    init: ->
        self = @
        $('a.tab-link').click (event) ->
            tab = $(@).attr('href').replace(/^#/, '')
            switch tab
                when 'stream' then self.switchToStream()
                when 'events' then self.switchToEvents()
            return false
        return

    switchToStream: ->
        @$eventsFeed.hide()
        @$streamFeed.show()
        return @

    switchToEvents: ->
        @$streamFeed.hide()
        @$eventsFeed.show()
        return @

tabs = new MainTabs()
tabs.init()
