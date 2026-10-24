export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const token = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'MERCADO_PAGO_ACCESS_TOKEN não configurado.' });
  }

  const { orderId, productTitle, amount, email, name, cpf } = req.body;

  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Idempotency-Key': `${orderId}-${Date.now()}`
      },
      body: JSON.stringify({
        transaction_amount: Number(amount),
        description: productTitle,
        payment_method_id: 'pix',
        payer: {
          email: email,
          first_name: name,
          identification: {
            type: 'CPF',
            number: cpf.replace(/\D/g, '')
          }
        },
        notification_url: `https://${req.headers.host}/api/webhook`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message || 'Erro ao gerar PIX' });
    }

    return res.status(200).json({
      paymentId: data.id,
      qrCodeBase64: data.point_of_interaction?.transaction_data?.qr_code_base64,
      copyPasteCode: data.point_of_interaction?.transaction_data?.qr_code,
      ticketUrl: data.point_of_interaction?.transaction_data?.ticket_url
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no servidor de pagamentos' });
  }
}
