FS = require 'fs'
PATH = require 'path'
CR = require 'crypto'

gType = process.argv[2]

END = new Date(2012, 5, 24, 8).getTime()
START = new Date(2012, 5, 23, 1).getTime()

exports.randomTimer = (from, to) ->
    return Math.floor(Math.random() * (to - from + 1) + from)

exports.uid = do ->
    hostname = null
    iCounter = 0
    last = 0
    fingerprint = ''

    for k, v of process.env
        fingerprint += "#{k}#{v}"

    uid = ->
        utime = new Date().getTime().toString()
        if utime is last
            iCounter += 1
            utimeString = utime + iCounter.toString()
        else
            utimeString = utime + '0'

        last = utime
        ustring = "#{fingerprint}#{process.pid}#{utimeString}"

        hasher = CR.createHash('sha1')
        hasher.update(ustring)
        return hasher.digest('hex')

    return uid

stringify = (obj) ->
    str = '{\n'
    for own p, v of obj
        if typeof v is 'string'
            str += '"' + p + '": "' + v + '",\n'
        else
            str += '"' + p + '": ' + v + ',\n'
    str = str.slice(0, str.length - 2) + '\n'
    return str += '}\n'

post =
    username: ""
    real_name: ""
    avatar_url: "http://"
    pubdate: exports.randomTimer(START, END)
    upvotes: Math.ceil(Math.random() * 80) * 4
    photo: "http://"
    content: ""

event =
    venue_name: ""
    headline: ""
    description: ""
    year: 2012
    month: 6
    day: 24
    time_start: "00:00"
    time_end: "00:00"
    street: ""
    city: "Cambridge"
    state: "MA"
    zip: "02142"
    pubdate: exports.randomTimer(START, END)

if gType is 'post'
    text = stringify(post)
else if gType is 'event'
    text = stringify(event)
else
    console.log "designate 'post' or 'event'"
    process.exit()

abspath = PATH.join(process.cwd(), "./#{exports.uid()}.json")
FS.writeFileSync(abspath, text, 'utf8')
console.log(text)
console.log(abspath)
