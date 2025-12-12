import dotenv from 'dotenv';
dotenv.config();

import { Resend } from 'resend'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import { fileURLToPath } from 'url'
import { RESEND_API_KEY, FRONTEND_URL } from '../config/env.js'

const resend = new Resend(process.env.RESEND_API_KEY);

// konfiguracja ścieżki szablonu
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templatePath = path.join(__dirname, '..', 'templates', 'reset-password.hbs')
const templateSource = fs.readFileSync(templatePath, 'utf8')
const tpl = handlebars.compile(templateSource)

// wysyłanie e-maila resetującego hasło
export async function sendResetEmail(email, token) {
  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`
  const html = tpl({ resetLink })
try{
     return resend.emails.send({
    from: 'Study <noreply@resend.dev>',
    to: email,
    subject: 'Reset hasła',
    html
  });
}catch (err){
    console.log("resend err:", err);
}
}
