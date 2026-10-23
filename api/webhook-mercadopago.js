import { createClient } from '@supabase/supabase-js';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const mpClient = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });
const payment = new Payment(mpClient);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { type, data } = req.body;

  if (type === 'payment' && data?.id) {
    try {
      const paymentInfo = await payment.get({ id: data.id });
      
      if (paymentInfo.status === 'approved') {
        const orderId = paymentInfo.external_reference;

        // Atualiza status no Supabase automaticamente
        await supabase
          .from('orders')
          .update({ status: 'approved' })
          .eq('order_code', orderId);
      }
    } catch (err) {
      console.error('Erro no Webhook:', err);
    }
  }

  return res.status(200).json({ received: true });
}
