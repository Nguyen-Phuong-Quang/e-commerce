const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.email.email_host,
        pass: config.email.email_host_pass,
    },
});

const sendMail = async (toMail, code, subject) => {
    const mailOptions = {
        from: config.email.email_host,
        to: toMail,
        subject: subject,
        html: `<h1>Code:</h1><br><h3>${code}</h3>`,
    };

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
};

exports.sendVerifyMail = async (toMail, code) => {
    const subject = "Creating account verification";
    await sendMail(toMail, code, subject);
};

exports.sendResetPassword = async (toMail, code) => {
    const subject = "Reset password verification";
    await sendMail(toMail, code, subject);
};
