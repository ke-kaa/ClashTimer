import nodemailer from 'nodemailer';
import validator from 'validator';
import handlebars from 'handlebars';
import { promises as fs } from 'fs';
import { config } from '../config/config.js';

let transporter = null;
let emailEnabled = Boolean(config.mail?.enabled);

if (emailEnabled) {
    transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: Number(config.mail.port),
        secure: config.mail.port === '465',
        auth: {
            user: config.mail.user,
            pass: config.mail.pass,
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        tls: {
            rejectUnauthorized: config.env === 'production',
        },
    });

    transporter.verify((error) => {
        if (error) {
            console.error('SMTP connection failed:', error);
            console.warn('Disabling email delivery. Check SMTP settings or network connectivity.');
            emailEnabled = false;
            transporter = null;
        } else {
            console.log('SMTP transporter ready');
        }
    });
} else {
    console.warn('Email delivery disabled: missing SMTP configuration.');
}

export async function sendEmail({ to, subject, template, context, text, attachments }) {
    try {
        if (!emailEnabled || !transporter) {
            console.info(`Email delivery skipped for ${to}. SMTP disabled or unavailable.`);
            return { success: false, skipped: true, reason: 'Email delivery disabled' };
        }

        // Validate recipients
        const recipients = Array.isArray(to) ? to : [to];
        for (const email of recipients) {
            if (!validator.isEmail(email)) {
                throw new Error(`Invalid email address: ${email}`);
            }
        }

        // Prepare HTML content from template if provided
        let html = '';
        if (template) {
            const templateContent = await fs.readFile(`./templates/${template}.hbs`, 'utf-8');
            const compiledTemplate = handlebars.compile(templateContent);
            html = compiledTemplate(context || {});
        }

        const info = await transporter.sendMail({
            from: config.mail.from,
            to: recipients.join(','),
            subject: subject || 'No Subject',
            text: text || '',
            html: html || '',
            attachments: attachments || [],
        });

        console.log(`Email sent to ${to}: ${info.messageId}`);
        return { success: true, info };
    } catch (error) {
        console.error(`Failed to send email to ${to}:`, error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};
