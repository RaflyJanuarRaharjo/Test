// api/telegram-webhook.js
//
// FUNGSI: Jadi "perantara" antara Telegram dan Google Apps Script.
// Apps Script selalu balas dengan redirect (302) yang bikin Telegram gagal.
// File ini nerima pesan dari Telegram, terusin ke Apps Script (fetch di sini
// otomatis ngikutin redirect), lalu langsung balas "ok" ke Telegram.
//
// GANTI URL di bawah dengan Web App URL Apps Script kamu yang terbaru.
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbydz-ax0rYo91osF5v3IoDT8SqwP2ZqI8hbWeFgYQd1R1JbsgJI_ShFZScyjb6_bdgR/exec';

export default async function handler(req, res) {
  // Teruskan data ke Apps Script dan TUNGGU sampai selesai sebelum
  // function ini berhenti. Kalau kita balas ke Telegram duluan lalu
  // berhenti, Vercel bisa mematikan proses sebelum fetch ke Apps
  // Script sempat jalan/selesai.
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      redirect: 'follow' // otomatis ikutin redirect 302 dari Apps Script
    });
  } catch (err) {
    console.error('Gagal meneruskan ke Apps Script:', err);
  }

  res.status(200).send('ok');
}
