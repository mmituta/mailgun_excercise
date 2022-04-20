import { MailgunTokenVerifier } from "./mailgun-token-verifier";
import * as crypto from "crypto";
import { MailgunSignature } from "../mailgun-message";

describe("Tests for the MailgunRequestVerifier class", () => {


    const timestamp = "timestamp";
    const token = "token";
    const signingKey = "any_string";
    const signature = crypto.createHmac('sha256', signingKey).update(timestamp.concat(token)).digest('hex')



    it('Should accept request if the signature equals encoded concatenation of token and timestamp', () => {
        const verifier: MailgunTokenVerifier = new MailgunTokenVerifier(signingKey);

        expect(verifier.comesFromMailgun(new MailgunSignature(token, timestamp, signature))).toBeTrue();
    });

    it('Should reject request if the token is different than in signature', () => {
        const verifier: MailgunTokenVerifier = new MailgunTokenVerifier(signingKey);
        expect(verifier.comesFromMailgun(new MailgunSignature(token+ "diff", timestamp, signature))).toBeFalse();

    });

    it('Should reject request if the timestamp is different than in signature', () => {
        const verifier: MailgunTokenVerifier = new MailgunTokenVerifier(signingKey);
        expect(verifier.comesFromMailgun(new MailgunSignature(token, timestamp+"diff", signature))).toBeFalse();
    });

    it('Should reject request if the signature doesnt match', () => {
        const verifier: MailgunTokenVerifier = new MailgunTokenVerifier(signingKey);
        expect(verifier.comesFromMailgun(new MailgunSignature(token, timestamp, signature+"diff"))).toBeFalse();
    });
});