import { sendEmail, } from '../email/sendEmail.js';

export async function emailController(req, res) {
  const { body, } = req;
  const {
    from, // Desde donde se envia el correo
    to, // A quien se envia el correo
    subject, // Titulo del correo
    cc, // A quien queremos añadir en copia
    html, // Cuerpo del correo electronico
  } = body;

  const result = await sendEmail({ from, to, subject, cc, html });
  if (!result) {
    return res.status(400).json({ message: 'Something went wrong sending email' });
  }

  return res.status(200).json({ message: 'Payload received' });
};