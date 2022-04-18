import { MailgunRequestVerifier } from "./mailgun-verifier";
import * as crypto from "crypto";

describe("Tests for the MailgunRequestVerifier class", () => {


    const timestamp = "timestamp";
    const token = "token";
    const signingKey = "any_string";
    const signature = crypto.createHmac('sha256',signingKey).update(timestamp.concat(token)).digest('hex')



    it('Should accept request if the signature equals encoded concatenation of token and timestamp', () => {
       const verifier: MailgunRequestVerifier = new MailgunRequestVerifier(signingKey);
        
        expect(verifier.verify( timestamp, token, signature)).toBeTrue();
    });

    it('Should reject request if the token is different than in signature', ()=>{
        const verifier: MailgunRequestVerifier = new MailgunRequestVerifier(signingKey);
        expect(verifier.verify( timestamp, token+"difference", signature)).toBeFalse();
 
    });

    it('Should reject request if the timestamp is different than in signature', ()=>{
        const verifier: MailgunRequestVerifier = new MailgunRequestVerifier(signingKey);
        expect(verifier.verify( timestamp+"difference", token, signature)).toBeFalse();
    });

    it('Should reject request if the signature doesnt match', ()=>{
        const verifier: MailgunRequestVerifier = new MailgunRequestVerifier(signingKey);
        expect(verifier.verify( timestamp, token, signature+"difference")).toBeFalse();
    });
});