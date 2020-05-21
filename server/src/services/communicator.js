const twilio = require('twilio');

var comClient = null;

function communicator(configs) {
    const client = getTwilioClient(configs);
    return {
        sendSMSToPax(phoneNumber, message) {
            client.messages.create({
                body: message,
                to: phoneNumber
            });
        }
    }
}


function getTwilioClient(config) {
    if (comClient !== null) {
        return comClient;
    }
    return twilio(config.accountSid, config.authToken);
}


export default communicator;