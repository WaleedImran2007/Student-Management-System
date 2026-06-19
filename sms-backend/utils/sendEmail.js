import nodemailer from 'nodemailer';

const sendEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        }
    });


    try {

        await transporter.sendMail({

            from: process.env.EMAIL,
            to: email,
            subject: 'Verify your Account',

            html: `
                <h2>Welcome</h2>
                <p>Click below to verify your account on Student Management System</p>

                <a href="http://localhost:5173/verify/${token}">
                    Verify Email
                </a>
            `
        });

    }

    catch (err) {
        console.log("EMAIL FAILED");
        console.log(err);
    }
}

export default sendEmail;