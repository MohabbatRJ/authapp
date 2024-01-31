import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

import ENV from '../config.js';

let nodeConfig = {
    service: "gmail",
    auth: {
        user: ENV.EMAIL,
        pass: ENV.PASSWORD,
    },
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/"
    },
});



/** POST: http://localhost:8080/api/registerMail 
 * @param: {
  "username" : "mohabbatrj",
  "userEmail" : "",
  "text" : "",
  "subject" : "",
}
*/
export const registerMail = async (req, res) => {

    try {

        const { username, userEmail, text, subject } = req.body;

        // body of the email
        var email = {
            body: {
                name: username,
                intro: text || "Welcome ! We\'re very excited to have you on board",
                outro: 'Need help, or have question? Just reply to this email, we\'d love to help',
                greeting: 'Dear',
                signature: 'Sincerely'
            }
        }

        var emailBody = MailGenerator.generate(email);

        let message = {
            from: ENV.EMAIL,
            to: userEmail,
            subject: subject || "Signup Successful",
            html: emailBody
        }

        // Send mail
        await transporter.sendMail(message);
        return res.status(200).send({ msg: "You should receive an email from us" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error });
    }
}