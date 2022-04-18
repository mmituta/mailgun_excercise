import { MailgunMessage } from "./mailgun-message";

describe('Tests for the MailgunMessage class', ()=>{

    const messageSignatureToken = "signatureToken";
    const messageSignatureTimestamp = "signatureTimestamp";
    const messageSignature = "signature";
    const messageId = "uniqueId";
    const messageTimestamp = 1521233195.375624;
    


    it('Should parse signature from JSON', ()=>{
        const message: MailgunMessage = MailgunMessage.fromJSON(sampleMessage);
     

        expect(message.signature.token).toEqual(messageSignatureToken);
        expect(message.signature.timestamp).toEqual(messageSignatureTimestamp);
        expect(message.signature.signature).toEqual(messageSignature);
    });

    it('Should parse event data from JSON', ()=>{
        const message: MailgunMessage = MailgunMessage.fromJSON(sampleMessage);
        expect(message.event.id).toEqual(messageId);
        expect(message.event.timestamp).toEqual(messageTimestamp);
    });

    const sampleMessage = `{
        "signature": {
            "token": "${messageSignatureToken}",
            "timestamp": "${messageSignatureTimestamp}",
            "signature": "${messageSignature}"
        },
        "event-data": {
            "id": "${messageId}",
            "timestamp": ${messageTimestamp},
            "log-level": "error",
            "event": "failed",
            "severity": "permanent",
            "reason": "suppress-bounce",
            "delivery-status": {
                "attempt-no": 1,
                "message": "",
                "code": 605,
                "enhanced-code": "",
                "description": "Not delivering to previously bounced address",
                "session-seconds": 0
            },
            "flags": {
                "is-routed": false,
                "is-authenticated": true,
                "is-system-test": false,
                "is-test-mode": false
            },
            "envelope": {
                "sender": "bob@sandbox137ba8eb5c17406295e77c3c72985e71.mailgun.org",
                "transport": "smtp",
                "targets": "alice@example.com"
            },
            "message": {
                "headers": {
                    "to": "Alice <alice@example.com>",
                    "message-id": "20130503192659.13651.20287@sandbox137ba8eb5c17406295e77c3c72985e71.mailgun.org",
                    "from": "Bob <bob@sandbox137ba8eb5c17406295e77c3c72985e71.mailgun.org>",
                    "subject": "Test permanent_fail webhook"
                },
                "attachments": [],
                "size": 111
            },
            "recipient": "alice@example.com",
            "recipient-domain": "example.com",
            "storage": {
                "url": "https://se.api.mailgun.net/v3/domains/sandbox137ba8eb5c17406295e77c3c72985e71.mailgun.org/messages/message_key",
                "key": "message_key"
            },
            "campaigns": [],
            "tags": [
                "my_tag_1",
                "my_tag_2"
            ],
            "user-variables": {
                "my_var_1": "Mailgun Variable #1",
                "my-var-2": "awesome"
            }
        }
    }`;
});

