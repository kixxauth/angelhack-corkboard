class MainNav
    constructor: ->
        @$feeds = $('#feeds')
        @$streamFeed = $('#stream-feed')
        @$eventsFeed = $('#events-feed')
        @$streamLink = $('a.link-stream')
        @$eventsLink = $('a.link-events')

    init: ->
        self = @
        $('a.tab-link').click (event) ->
            tab = $(@).attr('href').replace(/^#/, '')
            switch tab
                when 'stream' then self.switchToStream()
                when 'events' then self.switchToEvents()
            return false

        $('#feeds').find('.event').click (event) ->
            id = $(@).attr('id')
            console.log(id)
            self.switchToBig(id)
            return false

        $('.close-button').click (event) ->
            self.switchToFeeds()
            return false

        return @

    switchToStream: ->
        @$streamLink.addClass('active')
        @$eventsLink.removeClass('active')
        @$eventsFeed.hide()
        @$streamFeed.show()
        return @

    switchToEvents: ->
        @$streamLink.removeClass('active')
        @$eventsLink.addClass('active')
        @$streamFeed.hide()
        @$eventsFeed.show()
        return @

    switchToFeeds: ->
        @$big.hide()
        @$big = null
        @$feeds.show()
        return @

    switchToBig: (id) ->
        @$big = $("#big-#{id}")
        @$feeds.hide()
        @$big.show()
        return @

tabs = new MainNav()
tabs.init().switchToStream()
