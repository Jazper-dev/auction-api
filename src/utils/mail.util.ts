import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerifyEmail = async (email: string, token: string) => {
  const url = `${process.env.BASE_URL}${process.env.VERSION}/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: '"Auction System" <noreply@auction.com>',
    to: email,
    subject: "ยืนยันอีเมลของคุณสำหรับระบบประมูล",
    html: `<h3>ขอบคุณที่สมัครสมาชิก!</h3>
               <p>กรุณากดที่ลิงก์ด้านล่างเพื่อยืนยันตัวตน:</p>
               <a href="${url}">${url}</a>`,
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const url = `${process.env.BASE_URL}${process.env.VERSION}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: '"Auction System" <noreply@auction.com>',
    to: email,
    subject: "ยืนยันอีเมลของคุณสำหรับระบบประมูล",
    html: `
    <h3>คำขอรีเซ็ตรหัสผ่าน</h3>
    <p>เราได้รับคำขอรีเซ็ตรหัสผ่านของคุณ</p>
    <p>กรุณากดลิงก์ด้านล่างเพื่อตั้งรหัสผ่านใหม่:</p>
    <a href="${url}">${url}</a>
    <p>ลิงก์นี้จะหมดอายุภายใน 1 ชั่วโมง</p>
    <p>หากคุณไม่ได้เป็นผู้ร้องขอ กรุณาเพิกเฉยอีเมลฉบับนี้</p>
`,
  });
};
