import dotenv from 'dotenv';

dotenv.config();

import {Resend} from 'resend';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import {fileURLToPath} from 'url';
import {FRONTEND_URL} from '../config/env.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatePath = path.join(__dirname, '..', 'templates', 'reset-password.hbs');
const templateSource = fs.readFileSync(templatePath, 'utf8');
const tpl = handlebars.compile(templateSource);

export async function sendResetEmail(email, token) {
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    const html = tpl({resetLink});

    try {

        const res = await resend.emails.send({
            from: 'Study <noreply@study-app.pl>',
            to: email,
            subject: 'Reset hasła',
            html,
        });

        console.log("RESEND SUCCESS:", res);
        return res;

    } catch (err) {
        console.error("RESEND ERROR:", err);
        throw err;
    }
}
