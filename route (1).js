import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { contact, profile } = body;

    if (!contact) {
      return NextResponse.json({ error: 'Contact required' }, { status: 400 });
    }

    // Determine if email or phone
    const isEmail = contact.includes('@');
    const isPhone = /^[6-9]\d{9}$/.test(contact.replace(/\s/g, ''));

    // Save to Supabase
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    await supabase.from('alerts').insert({
      email: isEmail ? contact : null,
      whatsapp: isPhone ? contact : null,
      profile_json: profile || {},
      created_at: new Date().toISOString(),
      is_active: true,
    });

    // Send welcome email if email provided
    if (isEmail && process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'YojanaDarpan <alerts@yojanadarpan.in>',
        to: contact,
        subject: '✅ You are now subscribed to Government Scheme Alerts',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #E87722;">Welcome to YojanaDarpan Alerts! 🎉</h2>
            <p>You will now receive notifications when new government schemes are added that match your profile.</p>
            <p>In the meantime, check out the schemes you may already qualify for:</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}/find"
               style="display:inline-block; background:#E87722; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">
              Find My Schemes →
            </a>
            <p style="color:#888; font-size:12px; margin-top:30px;">
              YojanaDarpan · Not affiliated with Government of India<br>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe">Unsubscribe</a>
            </p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Alert signup error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
