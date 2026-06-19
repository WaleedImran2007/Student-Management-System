import nodemailer from 'nodemailer';

const sendEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        family: 4,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });


    try {

        console.log("FRONTEND_URL =", process.env.FRONTEND_URL);

        await transporter.sendMail({

            from: process.env.EMAIL,
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

    }

    catch (err) {
        console.log("EMAIL FAILED");
        console.log(err);
    }
}

export default sendEmail;