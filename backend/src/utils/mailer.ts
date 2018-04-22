import { isArray } from 'lodash';

const mailer = require('nodemailer');
const config = require('./config').default('mail');

export default function(receivers: string | string[], subject: string, text: string, html: string, callback = (err, info) => {}): void {
  if (isArray(receivers)) receivers = receivers.join(', ');

  // create reusable transporter object using the default SMTP transport
  const transporter = mailer.createTransport('smtps://logeek.webstudio%40gmail.com:1945logeek.webstudio9999@smtp.gmail.com');

  // setup email data with unicode symbols
  const mailOptions = {
    from: config.FROM, // sender address
    to: receivers, // list of receivers
    subject, // Subject line
    text, // plain text body
    html // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, callback);
}