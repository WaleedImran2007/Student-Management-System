import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, token) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',  // use this until you add a domain
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