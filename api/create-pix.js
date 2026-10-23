import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });
const payment = new Payment(client);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { orderId, productTitle, amount, email, name, cpf } = req.body;

  try {
    const body = {
      transaction_amount: Number(amount),
      description: `Forja Digital - ${productTitle}`,
      payment_method_id: 'pix',
      payer: {
        email: email,
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' ') || 'Silva',
        identification: { type: 'CPF', number: cpf.replace(/\D/g, '') }
      },
      external_reference: orderId,
      notification_url: `${process.env.VERCEL_URL_HOST}/api/webhook-mercadopago`
    };

    const response = await payment.create({ body });
    const pixData = response.point_of_interaction.transaction_data;

    return res.status(200).json({
      paymentId: response.id,
      qrCodeBase64: pixData.qr_code_base64,
      copyPasteCode: pixData.qr_code
    });
  } catch (error) {
    console.error('Erro PIX Mercado Pago:', error);
    return res.status(500).json({ error: 'Erro ao gerar cobrança PIX' });
  }
}
