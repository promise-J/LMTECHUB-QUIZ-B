import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GOOGLE_USER,
    pass: process.env.GOOGLE_PASSWORD,
  },
});

// const mailOptions = {
//   from: "hello@example.com",
//   to: "reciever@gmail.com",
//   subject: "Subject",
//   html: `<h1>This is the first time in a long time</h1>`
// };

async function sendMail(mailOptions) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log(info.response)
      // do something useful
    }
  });
}

export default sendMail;
