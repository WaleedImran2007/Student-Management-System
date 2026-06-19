import nodemailer from 'nodemailer';

const sendEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS,
        }
    });

    try {
        await transporter.sendMail({
            from: process.env.BREVO_USER,
            to: email,
            subject: 'Verify your Account',
            html: `
                <h2>Welcome</h2>
                <p>Click below to verify your account on Student Management System</p>
                <a href="${process.env.FRONTEND_URL}/verify/${token}">
                    Verify Email
                </a>
            `
        });
        console.log("EMAIL SENT SUCCESSFULLY");
    } catch (err) {
        console.log("EMAIL FAILED");
        console.log(err);
    }
};

export default sendEmail;