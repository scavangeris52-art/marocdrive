/**
 * Service email pour MarocDrive / MimounRifCar
 * Utilise Nodemailer — configure les variables SMTP dans .env
 */

import nodemailer from 'nodemailer'

// Lazy transporter — n'initialise que si les vars SMTP sont définies
function getTransporter() {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASSWORD

  if (!host || !user || !pass) {
    console.warn('[Email] SMTP non configuré — emails désactivés')
    return null
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: { user, pass },
  })
}

const FROM = process.env.SMTP_FROM || 'contact@mimounrifcar.ma'

// ─── Confirmation de réservation ────────────────────────────────────
interface BookingEmailData {
  to: string
  customerName: string
  carName: string
  pickupDate: string
  returnDate: string
  pickupCity: string
  totalPrice: number
  bookingId: number
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const transporter = getTransporter()
  if (!transporter) return

  await transporter.sendMail({
    from: `"MimounRifCar" <${FROM}>`,
    to: data.to,
    subject: `Confirmation de réservation #${data.bookingId} — MimounRifCar`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#111;color:#fff;padding:30px;border-top:3px solid #cc0000">
        <h1 style="color:#cc0000;margin:0 0 20px">MimounRifCar</h1>
        <p>Bonjour <strong>${data.customerName}</strong>,</p>
        <p>Votre réservation a bien été enregistrée.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr><td style="padding:8px;border-bottom:1px solid #333;color:#999">Réservation</td><td style="padding:8px;border-bottom:1px solid #333">#${data.bookingId}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #333;color:#999">Véhicule</td><td style="padding:8px;border-bottom:1px solid #333">${data.carName}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #333;color:#999">Prise en charge</td><td style="padding:8px;border-bottom:1px solid #333">${data.pickupDate} — ${data.pickupCity}</td></tr>
          <tr><td style="padding:8px;border-bottom:1px solid #333;color:#999">Retour</td><td style="padding:8px;border-bottom:1px solid #333">${data.returnDate}</td></tr>
          <tr><td style="padding:8px;color:#999">Total</td><td style="padding:8px;font-size:18px;color:#cc0000;font-weight:bold">${data.totalPrice} MAD</td></tr>
        </table>
        <p>Nous vous contacterons sous peu pour confirmer les détails.</p>
        <p style="color:#666;font-size:12px;margin-top:30px">MimounRifCar — Location de voitures au Maroc<br>+212 6 61 23 45 67</p>
      </div>
    `,
  })
}

// ─── Notification contact admin ─────────────────────────────────────
interface ContactData {
  name: string
  email: string
  phone: string
  message: string
}

export async function sendContactNotification(data: ContactData) {
  const transporter = getTransporter()
  if (!transporter) return

  const adminEmail = process.env.SMTP_FROM || FROM

  await transporter.sendMail({
    from: `"MimounRifCar Site" <${FROM}>`,
    to: adminEmail,
    replyTo: data.email,
    subject: `Nouveau message de ${data.name} — MimounRifCar`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <h2 style="color:#cc0000">Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${data.name}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Téléphone :</strong> ${data.phone || 'Non renseigné'}</p>
        <hr style="border:1px solid #eee;margin:15px 0">
        <p>${data.message}</p>
      </div>
    `,
  })
}
