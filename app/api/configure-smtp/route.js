import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { email, appPassword, smtpHost, smtpPort } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid Gmail or email address.' },
        { status: 400 }
      );
    }

    if (!appPassword || appPassword.trim().length < 6) {
      return NextResponse.json(
        { error: 'Please enter a valid password or 16-character Google App Password.' },
        { status: 400 }
      );
    }

    const host = smtpHost || (email.endsWith('@gmail.com') ? 'smtp.gmail.com' : 'smtp.gmail.com');
    const port = parseInt(smtpPort || '465');
    const cleanPassword = appPassword.replace(/\s+/g, '');

    // 1. Verify connection with SMTP server
    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: port === 465,
      auth: {
        user: email.trim(),
        pass: cleanPassword,
      },
    });

    await transporter.verify();

    // 2. Set runtime environment variables immediately
    process.env.SMTP_HOST = host;
    process.env.SMTP_PORT = String(port);
    process.env.SMTP_USER = email.trim();
    process.env.SMTP_PASS = cleanPassword;
    process.env.EMAIL_FROM = `Doc Studio <${email.trim()}>`;

    // 3. Persist to .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
    const envContent = `# Configured SMTP Credentials\nSMTP_HOST=${host}\nSMTP_PORT=${port}\nSMTP_USER=${email.trim()}\nSMTP_PASS=${cleanPassword}\nEMAIL_FROM=Doc Studio <${email.trim()}>\n`;
    fs.writeFileSync(envPath, envContent, 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'SMTP credentials verified and saved successfully! You can now send real emails.',
      provider: 'Gmail / SMTP',
    });
  } catch (err) {
    console.error('SMTP Verification Failed:', err);

    let friendlyError = err.message || 'Failed to authenticate with SMTP server.';
    if (err.message?.includes('535') || err.message?.includes('BadCredentials')) {
      friendlyError = 'Invalid credentials. For Gmail, you must use a 16-character "App Password" (not your normal Google password). Generate one at https://myaccount.google.com/apppasswords';
    }

    return NextResponse.json(
      { error: friendlyError },
      { status: 401 }
    );
  }
}
