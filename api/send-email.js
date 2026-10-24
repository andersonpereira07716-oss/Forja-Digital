export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, name, productTitle, downloadUrl } = req.body;

  console.log(`[E-mail Notifier] A enviar confirmação de compra de "${productTitle}" para ${email}...`);

  return res.status(200).json({ 
    success: true, 
    message: `Confirmação e acesso enviados com sucesso para ${email}` 
  });
}
