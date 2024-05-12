import nodemailer from "nodemailer";
import { SENDER_EMAIL,EMAIL_PASS } from "../../config/config.js";
async function sendEmail({ to = '', subject = '', message = '', attachments = [] } = {}) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host:"smtp.gmail.com", 
        port: 587, 
        auth: {
            user: SENDER_EMAIL, // generated ethereal user
            pass: EMAIL_PASS, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: `"Brain Cancer" <${SENDER_EMAIL}>`, // sender address
        to,
        subject,
        html:message,
        attachments
    });

    return info.rejected.length ? false : true
}



export default sendEmail