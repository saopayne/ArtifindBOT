/**
 * Created by saopayne on 5/9/16.
 */

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am an Artifind chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


//Batch notify users of a messages on the Facebook page (still open to ideas)
app.post('/new-messages/', function () {
    console.log('send messages to admin');
})

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'Find' || text === 'Get' || text === 'Search') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "How can I help you? You sent this ->: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})


var token = ""


function sendTextMessage(sender, text) {
    messageData = {
        text: text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: token},
        method: 'POST',
        json: {
            recipient: {id: sender},
            message: messageData,
        }
    }, function (error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    });
}

function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Mechanic",
                    "subtitle": "Different types of mechanic",
                    "image_url": "https://www.google.com.ng/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiUjZis3NDMAhXlKsAKHUP3AtQQjRwIBw&url=http%3A%2F%2Fwww.bbc.co.uk%2Fnews%2Fworld-africa-11429067&psig=AFQjCNEVRhLVUW0l2OnsBlhDS-hjlJa9rw&ust=1463011408007930",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Tailor",
                    "subtitle": "Different tailor specialisations",
                    "image_url": "https://www.google.com.ng/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiViIC83NDMAhXKLMAKHVdLA2gQjRwIBw&url=http%3A%2F%2Fzikoko.com%2Flist%2Fthe-complete-guide-to-being-a-nigerian-tailor%2F&bvm=bv.121421273,d.ZGg&psig=AFQjCNE8M0vUabYb8F7CIALheztw7gHLUQ&ust=1463011440029373",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                },
                    {
                    "title": "Barber",
                    "subtitle": "Different barber specialisations",
                    "image_url": "https://www.google.com.ng/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiViIC83NDMAhXKLMAKHVdLA2gQjRwIBw&url=http%3A%2F%2Fzikoko.com%2Flist%2Fthe-complete-guide-to-being-a-nigerian-tailor%2F&bvm=bv.121421273,d.ZGg&psig=AFQjCNE8M0vUabYb8F7CIALheztw7gHLUQ&ust=1463011440029373",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                     }],
                },
                    {
                        "title": "Hairdresser",
                        "subtitle": "Different hairdresser specialisations",
                        "image_url": "https://www.google.com.ng/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=0ahUKEwiViIC83NDMAhXKLMAKHVdLA2gQjRwIBw&url=http%3A%2F%2Fzikoko.com%2Flist%2Fthe-complete-guide-to-being-a-nigerian-tailor%2F&bvm=bv.121421273,d.ZGg&psig=AFQjCNE8M0vUabYb8F7CIALheztw7gHLUQ&ust=1463011440029373",
                        "buttons": [{
                            "type": "postback",
                            "title": "Postback",
                            "payload": "Payload for second element in a generic bubble",
                        }],
                    }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
