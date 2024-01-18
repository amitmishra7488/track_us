const nodemailer = require("nodemailer");
require("dotenv").config();

// Function to send an email
const sendEmail = async (email,name,message) => {
    console.log(email,message);
    console.log(process.env.GMAILUSERNAME);
  try {
    console.log(process.env.GMAILUSERNAME,process.env.GMAILPASSWORD)
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAILUSERNAME,
          pass: process.env.GMAILPASSWORD,
        },
      });

    const mailOptions = {
      from: process.env.GMAILUSERNAME,
      to: email,
      subject: "Otp Verification for track_us account creation",
      text: `This is a test email.${message}`,
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
            color: #333;
            margin: 0;
            padding: 0;
          }
      
          .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
      
          h1 {
            color: #007bff;
          }
      
          p {
            margin-bottom: 20px;
          }
      
          .otp-code {
            font-size: 24px;
            color: #28a745;
            font-weight: bold;
            display: inline-block;
            padding: 8px;
            background-color: #e6f7e1;
            border-radius: 4px;
          }
      
          .footer {
            margin-top: 20px;
            text-align: center;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>OTP Verification</h1>
          <p>Dear ${name},</p>
          <p>Your OTP for account creation on track_us is:</p>
          <p class="otp-code">${message}</p>
          <p>Please use this code to complete your registration process. Do not share this code with anyone.</p>
          <div class="footer">
            <p>If you did not request this OTP, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    return info.response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

module.exports = {
  sendEmail,
};
