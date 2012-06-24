exports.short = (input, max = 140) ->
    return input.substring(0, max)

exports.get_event_date = (event) ->
    return new Date(event.year, event.month, event.day)

exports.get_event_address = (event) ->
    return "#{event.street}, #{event.city} #{event.state}, #{event.zip}"