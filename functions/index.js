'use strict';

process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiAssistant;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const authServer = require('./authserver');
const loginService = require('./login');


// API.AI Intent names
const LIGHTS_ON = 'lightson';
const LIGHTS_OFF = 'lightsoff';


// Auth initial endpoint: return login html page to user, and redirect to /login when user submit the form
exports.authserver = functions.https.onRequest(authServer.handler);

// Login service: return auth token if login ok
exports.login = functions.https.onRequest(loginService.handler);

//
// GOOGLE ACTIONS HANDLERS
//
exports.googleactionshandler = functions.https.onRequest((request, response) => {
    console.log('headers: ' + JSON.stringify(request.headers));
    console.log('body: ' + JSON.stringify(request.body));

    var token = request.body.originalRequest.data.user.accessToken;
    var firebaseUid = token.replace(/MYACCESSTOKEN/g, '');
    const notifications = admin.database().ref('notifications/fromassistanttouser/' + firebaseUid);
    /**
     * With notifications database reference you can have other application listen for changes in 'notifications/fromassistanttouser/'
     * database node and know what user (user Uid) trigger the action and what want to do.
     * For example, an application listen for changes, and send lights on/off order trought MQTT protocol.
     */

    const assistant = new Assistant({ request: request, response: response });

    let actionMap = new Map();
    actionMap.set(LIGHTS_ON, lightsOn);
    actionMap.set(LIGHTS_OFF, lightsOff);
    assistant.handleRequest(actionMap);

    function lightsOn(assistant) {
        console.log('lightsOn');

        var room = request.body.result.parameters.Room;

        const speech = `<speak>
        Ok! I'm going to turn on the ${room} lights... <break time="3"/>
        Lights On!
        </speak>`;


        // NOTIFICATION TO FIREBASE
        var newNotification = notifications.push();
        newNotification.set({
            GoogleAssistantAction: "LIGHTS_ON",
            Room: room
        });

        assistant.ask(speech);
    }

    function lightsOff(assistant) {
        console.log('lightsOff');

        var room = request.body.result.parameters.Room;

        const speech = `<speak>
        Ok! I'm going to turn off the ${room} lights... <break time="3"/>
        Lights Off!
        </speak>`;

        // NOTIFICATION TO FIREBASE
        var newNotification = notifications.push();
        newNotification.set({
            GoogleAssistantAction: "LIGHTS_OFF",
            Room: room
        });

        assistant.ask(speech);
    }

});
