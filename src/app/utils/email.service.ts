import nodemailer from "nodemailer";

// Create transporter using Gmail SMTP
const createTransporter = () => {
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Use App Password for Gmail
        },
    });
};

// Email templates with beautiful formatting
const getStudentRegistrationTemplate = (data: {
    studentName: string;
    examId: string;
    email: string;
    password: string;
    examDate: string;
    loginUrl: string;
}) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IELTS Exam Registration</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🎓 BdCalling Academy</h1>
                            <p style="color: #cffafe; margin: 10px 0 0 0; font-size: 16px;">IELTS Exam Portal</p>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td style="padding: 40px 30px 20px 30px;">
                            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${data.studentName}! 🎉</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0;">
                                Congratulations! Your IELTS exam registration has been successfully completed. Below are your login credentials:
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Credentials Box -->
                    <tr>
                        <td style="padding: 0 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%); border-radius: 12px; border: 2px solid #0891b2;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="color: #0e7490; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #0891b2; padding-bottom: 10px;">📋 Your Login Credentials</h3>
                                        
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #1f2937; font-weight: 600; width: 120px;">Exam ID:</td>
                                                <td style="color: #0891b2; font-size: 18px; font-weight: 700; font-family: 'Courier New', monospace; background: #ffffff; padding: 8px 12px; border-radius: 6px;">${data.examId}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #1f2937; font-weight: 600;">Email:</td>
                                                <td style="color: #4b5563;">${data.email}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #1f2937; font-weight: 600;">Password:</td>
                                                <td style="color: #0891b2; font-weight: 700; font-family: 'Courier New', monospace; background: #ffffff; padding: 8px 12px; border-radius: 6px;">${data.password}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #1f2937; font-weight: 600;">Exam Date:</td>
                                                <td style="color: #dc2626; font-weight: 700;">${data.examDate}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Login Button -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <a href="${data.loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(8, 145, 178, 0.4);">
                                🚀 Login Now
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Important Notice -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="color: #92400e; margin: 0; font-size: 14px;">
                                            ⚠️ <strong>Important:</strong> Please do not share your password with anyone. During the exam, do not exit full-screen mode as it may result in disqualification.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1f2937; padding: 25px 30px; text-align: center;">
                            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                                © ${new Date().getFullYear()} BdCalling Academy. All rights reserved.
                            </p>
                            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                                For any queries, contact us at: support@bdcalling.com
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

const getResultPublishedTemplate = (data: {
    studentName: string;
    examId: string;
    listeningBand: number;
    readingBand: number;
    writingBand: number;
    speakingBand: number;
    overallBand: number;
    examDate: string;
    resultUrl: string;
}) => {
    const getBandColor = (band: number) => {
        if (band >= 7) return "#059669"; // Green
        if (band >= 5) return "#0891b2"; // Cyan
        return "#dc2626"; // Red
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IELTS Result Published</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">🎉 Your Results Are Ready!</h1>
                            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">BdCalling Academy IELTS</p>
                        </td>
                    </tr>
                    
                    <!-- Congratulations Message -->
                    <tr>
                        <td style="padding: 40px 30px 20px 30px; text-align: center;">
                            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 22px;">Congratulations, ${data.studentName}! 🏆</h2>
                            <p style="color: #6b7280; font-size: 14px; margin: 0;">Exam ID: <strong>${data.examId}</strong> | Exam Date: <strong>${data.examDate}</strong></p>
                        </td>
                    </tr>
                    
                    <!-- Overall Band Score -->
                    <tr>
                        <td style="padding: 0 30px; text-align: center;">
                            <table width="200" cellpadding="0" cellspacing="0" style="margin: 0 auto; background: linear-gradient(135deg, ${getBandColor(data.overallBand)} 0%, ${getBandColor(data.overallBand)}dd 100%); border-radius: 100px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);">
                                <tr>
                                    <td style="padding: 30px; text-align: center;">
                                        <p style="color: rgba(255,255,255,0.9); margin: 0 0 5px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Overall Band</p>
                                        <p style="color: #ffffff; margin: 0; font-size: 56px; font-weight: 800;">${data.overallBand}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Module Scores -->
                    <tr>
                        <td style="padding: 30px;">
                            <table width="100%" cellpadding="0" cellspacing="10">
                                <tr>
                                    <!-- Listening -->
                                    <td width="50%" style="background-color: #f0f9ff; border-radius: 12px; text-align: center; padding: 20px 10px;">
                                        <p style="color: #0369a1; margin: 0 0 5px 0; font-size: 12px; font-weight: 600;">🎧 LISTENING</p>
                                        <p style="color: #0c4a6e; margin: 0; font-size: 32px; font-weight: 700;">${data.listeningBand}</p>
                                    </td>
                                    <!-- Reading -->
                                    <td width="50%" style="background-color: #ecfdf5; border-radius: 12px; text-align: center; padding: 20px 10px;">
                                        <p style="color: #047857; margin: 0 0 5px 0; font-size: 12px; font-weight: 600;">📖 READING</p>
                                        <p style="color: #064e3b; margin: 0; font-size: 32px; font-weight: 700;">${data.readingBand}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <!-- Writing -->
                                    <td width="50%" style="background-color: #fef3c7; border-radius: 12px; text-align: center; padding: 20px 10px;">
                                        <p style="color: #b45309; margin: 0 0 5px 0; font-size: 12px; font-weight: 600;">✍️ WRITING</p>
                                        <p style="color: #78350f; margin: 0; font-size: 32px; font-weight: 700;">${data.writingBand}</p>
                                    </td>
                                    <!-- Speaking -->
                                    <td width="50%" style="background-color: #fff7ed; border-radius: 12px; text-align: center; padding: 20px 10px;">
                                        <p style="color: #c2410c; margin: 0 0 5px 0; font-size: 12px; font-weight: 600;">🎙️ SPEAKING</p>
                                        <p style="color: #7c2d12; margin: 0; font-size: 32px; font-weight: 700;">${data.speakingBand}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- View Full Result Button -->
                    <tr>
                        <td style="padding: 10px 30px 30px 30px; text-align: center;">
                            <a href="${data.resultUrl}" style="display: inline-block; background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(8, 145, 178, 0.4);">
                                📊 View Detailed Results
                            </a>
                        </td>
                    </tr>
                    
                    <!-- Thank You Message -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; border-radius: 8px;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <p style="color: #4b5563; margin: 0; font-size: 15px; line-height: 1.6;">
                                            Thank you for choosing BdCalling Academy for your IELTS preparation.<br>
                                            We wish you all the best in your future endeavors! 🌟
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1f2937; padding: 25px 30px; text-align: center;">
                            <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                                © ${new Date().getFullYear()} BdCalling Academy. All rights reserved.
                            </p>
                            <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 12px;">
                                For any queries, contact us at: support@bdcalling.com
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

// Send student registration email
export const sendStudentRegistrationEmail = async (data: {
    studentName: string;
    examId: string;
    email: string;
    password: string;
    examDate: Date;
}) => {
    try {
        const transporter = createTransporter();
        const loginUrl = process.env.FRONTEND_URL || "https://ielts.bdcalling.com";

        const mailOptions = {
            from: `"BdCalling Academy IELTS" <${process.env.EMAIL_USER}>`,
            to: data.email,
            subject: `🎓 IELTS Exam Registration Successful - ${data.examId}`,
            html: getStudentRegistrationTemplate({
                studentName: data.studentName,
                examId: data.examId,
                email: data.email,
                password: data.password,
                examDate: new Date(data.examDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                loginUrl: `${loginUrl}/login`,
            }),
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Registration email sent successfully:", result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error("Failed to send registration email:", error);
        return { success: false, error };
    }
};

// Send result published email
export const sendResultPublishedEmail = async (data: {
    studentName: string;
    examId: string;
    email: string;
    listeningBand: number;
    readingBand: number;
    writingBand: number;
    speakingBand: number;
    overallBand: number;
    examDate: Date;
}) => {
    try {
        const transporter = createTransporter();
        const resultUrl = process.env.FRONTEND_URL || "https://ielts.bdcalling.com";

        const mailOptions = {
            from: `"BdCalling Academy IELTS" <${process.env.EMAIL_USER}>`,
            to: data.email,
            subject: `🏆 Your IELTS Result is Ready - Overall Band ${data.overallBand}`,
            html: getResultPublishedTemplate({
                studentName: data.studentName,
                examId: data.examId,
                listeningBand: data.listeningBand,
                readingBand: data.readingBand,
                writingBand: data.writingBand,
                speakingBand: data.speakingBand,
                overallBand: data.overallBand,
                examDate: new Date(data.examDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }),
                resultUrl: `${resultUrl}/result/${data.examId}`,
            }),
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("Result email sent successfully:", result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error("Failed to send result email:", error);
        return { success: false, error };
    }
};

export const EmailService = {
    sendStudentRegistrationEmail,
    sendResultPublishedEmail,
};

