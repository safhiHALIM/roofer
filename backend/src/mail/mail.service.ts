import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private from: string;
  private logOnly = false;

  constructor(private readonly config: ConfigService) {
    const host = this.config.getOrThrow<string>('SMTP_HOST');

    if (host === 'console') {
      // Development fallback: write emails to console, avoid network calls.
      this.logOnly = true;
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true,
      });
      this.from = this.config.get<string>('EMAIL_FROM') || 'noreply@roofer-univers.test';
    } else {
      const port = Number(this.config.getOrThrow<string>('SMTP_PORT'));
      const secure = port === 465; // implicit SSL
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user: this.config.getOrThrow<string>('SMTP_USER'),
          pass: this.config.getOrThrow<string>('SMTP_PASS'),
        },
        tls: secure ? { servername: host } : undefined,
      });
      this.from = this.config.getOrThrow<string>('EMAIL_FROM');
    }
  }

  async sendVerificationEmail(email: string, token: string, frontendUrl?: string) {
    const verifyUrl = `${frontendUrl || ''}/verify-email?token=${token}`;
    const html = this.buildVerificationTemplate(verifyUrl);
    const info = await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: 'Verify your email - Roofer Univers',
      html,
    });
    if (this.logOnly) {
      // Helps developers grab the link without real SMTP
      // eslint-disable-next-line no-console
      console.log('[MAIL][console] verification link:', verifyUrl);
      // eslint-disable-next-line no-console
      console.log('[MAIL][console] raw message:\n', info.message?.toString?.());
    }
  }

  async sendOrderEmails(payload: { userEmail: string; orderId: string; items: any; total: number }) {
    const adminEmail = this.from;
    const html = this.buildOrderTemplate(payload);
    const sends = await Promise.all([
      this.transporter.sendMail({
        from: this.from,
        to: payload.userEmail,
        subject: `Order ${payload.orderId} confirmed`,
        html,
      }),
      this.transporter.sendMail({
        from: this.from,
        to: adminEmail,
        subject: `New order ${payload.orderId}`,
        html,
      }),
    ]);
    if (this.logOnly) {
      // eslint-disable-next-line no-console
      console.log('[MAIL][console] order payload:', payload);
      // eslint-disable-next-line no-console
      console.log('[MAIL][console] raw messages:\n', sends.map((s) => s.message?.toString?.()).join('\n---\n'));
    }
  }

  private buildVerificationTemplate(url: string) {
    return `
      <div style="font-family: Arial, sans-serif; padding: 24px; background:#0b1220; color:#f5f7fb;">
        <h2 style="margin:0 0 12px 0;">Bienvenue chez Roofer Univers</h2>
        <p style="margin:0 0 16px 0;">Merci de confirmer votre email pour activer votre compte.</p>
        <a href="${url}" style="display:inline-block; padding:12px 20px; background:#22c55e; color:#0b1220; text-decoration:none; border-radius:8px; font-weight:700;">Vérifier mon email</a>
        <p style="margin-top:16px; font-size:12px; color:#cbd5e1;">Si le bouton ne fonctionne pas, copiez ce lien : ${url}</p>
      </div>
    `;
  }

  private buildOrderTemplate(payload: { userEmail: string; orderId: string; items: any; total: number }) {
    const itemsList = Array.isArray(payload.items)
      ? payload.items
          .map((item: any) => `
            <tr>
              <td style="padding:8px 12px; border-bottom:1px solid #eee;">${item.name || item.productId}</td>
              <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:center;">${item.quantity || 1}</td>
              <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:right;">${item.price ? item.price.toFixed(2) : ''} €</td>
            </tr>
          `)
          .join('')
      : '';

    return `
      <div style="font-family: Arial, sans-serif; padding:24px; background:#f8fafc; color:#0f172a;">
        <h2 style="margin-top:0;">Merci pour votre commande</h2>
        <p>Commande #${payload.orderId}</p>
        <table style="width:100%; border-collapse:collapse; margin-top:12px;">${itemsList}</table>
        <p style="font-weight:700; margin-top:12px;">Total: ${payload.total.toFixed(2)} €</p>
        <p style="font-size:12px; color:#475569;">Une copie a été envoyée à l'administrateur.</p>
      </div>
    `;
  }
}
