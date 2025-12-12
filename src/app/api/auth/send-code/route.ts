import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory storage for verification codes (for production, use Redis or database)
const verificationCodes = new Map<string, { code: string; expiresAt: number; firstName?: string; lastName?: string }>();

// Clean up expired codes every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (data.expiresAt < now) {
      verificationCodes.delete(email);
    }
  }
}, 5 * 60 * 1000);

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code
    verificationCodes.set(email.toLowerCase(), { 
      code, 
      expiresAt,
      firstName,
      lastName
    });

    // Send email via Gmail
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"LUMINIX" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your LUMINIX Sign-In Code',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 100%); color: #e6d5f5; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .code-box { background: #f4f4f4; border: 2px dashed #9966cc; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px; }
                .code { font-size: 36px; font-weight: bold; color: #9966cc; letter-spacing: 8px; }
                .content { padding: 30px; background: #ffffff; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">LUMINIX</h1>
                  <p style="margin: 10px 0 0 0;">Embrace the darkness with style</p>
                </div>
                <div class="content">
                  <h2 style="color: #1a0b2e;">Your Verification Code</h2>
                  <p>Enter this code to sign in to your LUMINIX account:</p>
                  <div class="code-box">
                    <div class="code">${code}</div>
                  </div>
                  <p><strong>This code expires in 10 minutes.</strong></p>
                  <p>If you didn't request this code, you can safely ignore this email.</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} LUMINIX. All rights reserved.</p>
                  <p>www.luminixclothing.com</p>
                </div>
              </div>
            </body>
          </html>
        `,
        text: `Your LUMINIX verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
      });

      return NextResponse.json({ 
        success: true,
        message: 'Verification code sent to your email'
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json({ 
        error: 'Failed to send email. Please check your email configuration.' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Send code error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Export the verification codes map for use in verify-code route
export { verificationCodes };
