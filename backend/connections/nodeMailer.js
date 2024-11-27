const nodemailer = require("nodemailer");

const sendMail = async function (doc) {
  try {
    console.log(doc);

    // transporter
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // send mail
    let info = await transporter.sendMail({
      from: `Semester Simplfied`,
      to: doc.email,
      subject: `Account Created Successfully`,
      html: `<p>${doc.name}, Welcome to Semester Simplified. Hope you have a great expirience ahead.</p></br>
        You can edit your profile here: <a href="https://semester-simplified-frontend.vercel.app/myProfile?user=${doc._id}">
        https://semester-simplified-frontend.vercel.app/myProfile?user=${doc._id}</a>`,
    });

    console.log(info);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMail };
