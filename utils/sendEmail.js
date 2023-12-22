import nodemailer from 'nodemailer';

const sendEmail = async (emailId,subject,message)=>{
    try {
        const  transporter = nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.SMTP_USERNAME,
                pass:process.env.SMTP_PASSWORD,
            },
            authMethod:"plain"
        });

        await transporter.sendMail({
            from:process.env.SMTP_FROM_EMAIL,
            to:emailId,
            subject:subject,
            html:message,
        });

    } catch (error) {
        if(error) 
            throw error;
    }
}

export default sendEmail;