import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            }
        });

        const info = await transporter.sendMail({
            from: `Playzone | Shashwat <${process.env.MAIL_USER}>`, // sender address
            to: email,
            subject: title,
            html: body,
        });
        console.log("Message sent: %s", info.messageId);

    } catch (err) {
        console.log('error while sending mail', err.message);
    }
}

export { mailSender };