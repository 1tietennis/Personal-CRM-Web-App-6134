import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { contact } = await req.json();

    // Configure SMTP client
    const client = new SmtpClient();
    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOSTNAME'),
      port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
      username: Deno.env.get('SMTP_USERNAME'),
      password: Deno.env.get('SMTP_PASSWORD'),
    });

    // Send welcome email
    await client.send({
      from: Deno.env.get('SMTP_FROM'),
      to: contact.email,
      subject: `Welcome to Our Network, ${contact.name}!`,
      content: `
        <h2>Welcome ${contact.name}!</h2>
        <p>Thank you for joining our network. We're excited to have you on board!</p>
        <p>Here's what you can expect:</p>
        <ul>
          <li>Regular updates about our services</li>
          <li>Important announcements</li>
          <li>Exclusive offers and insights</li>
        </ul>
        <p>Feel free to reach out if you have any questions.</p>
        <br>
        <p>Best regards,</p>
        <p>Your Team</p>
      `,
      html: true,
    });

    await client.close();

    // Log email success in Supabase
    const { error: logError } = await supabaseClient
      .from('email_logs')
      .insert({
        contact_id: contact.id,
        type: 'welcome',
        status: 'sent',
        sent_at: new Date().toISOString(),
      });

    if (logError) throw logError;

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending welcome email:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});