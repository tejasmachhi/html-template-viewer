import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  const isSmtp = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  const isResend = Boolean(process.env.RESEND_API_KEY);

  return NextResponse.json({
    configured: isSmtp || isResend,
    provider: isSmtp ? 'SMTP' : isResend ? 'Resend' : 'None',
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, subject, html, customerName, templateName } = body;

    // Validate email address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!to || !emailRegex.test(to.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid recipient email address (e.g. yourname@gmail.com).' },
        { status: 400 }
      );
    }

    if (!html || html.trim().length === 0) {
      return NextResponse.json(
        { error: 'Cannot send email: rendered HTML template content is empty.' },
        { status: 400 }
      );
    }

    // 1. Try SMTP Server (Gmail, Outlook, custom SMTP)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const port = parseInt(process.env.SMTP_PORT || '465');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.SMTP_USER,
        to: to.trim(),
        subject: subject || 'Document Delivery',
        html: html,
      });

      return NextResponse.json({
        success: true,
        provider: 'SMTP Server',
        messageId: info.messageId,
        to: to.trim(),
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Try Resend API if key is provided
    if (process.env.RESEND_API_KEY) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Doc Studio <onboarding@resend.dev>',
          to: [to.trim()],
          subject: subject || 'Document Delivery',
          html: html,
        }),
      });

      const resendData = await resendRes.json();
      if (resendRes.ok) {
        return NextResponse.json({
          success: true,
          provider: 'Resend API',
          messageId: resendData.id,
          to: to.trim(),
          timestamp: new Date().toISOString(),
        });
      } else {
        throw new Error(resendData.message || 'Resend API rejected email delivery.');
      }
    }

    // 3. Neither is configured
    return NextResponse.json(
      {
        success: false,
        configured: false,
        error:
          'No live email delivery provider is configured. To deliver real emails to actual inboxes, configure SMTP credentials (e.g. Gmail SMTP + App Password) or RESEND_API_KEY in your .env.local file.',
      },
      { status: 422 }
    );
  } catch (err) {
    console.error('Email Dispatch Error:', err);
    return NextResponse.json(
      { error: err.message || 'An error occurred while sending email.' },
      { status: 500 }
    );
  }
}
