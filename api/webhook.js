export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { type, data } = req.body;

  if (type === 'payment' && data?.id) {
    console.log(`[Mercado Pago Webhook] Pagamento recebido: ${data.id}`);
    // O status do pagamento pode ser verificado e atualizado diretamente no Supabase
  }

  return res.status(200).send('OK');
}
