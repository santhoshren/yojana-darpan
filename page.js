export const metadata = {
  title: 'Privacy Policy - YojanaDarpan',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: December 2024</p>

          <div className="space-y-6 text-gray-700 leading-relaxed text-sm">
            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
              <p>
                YojanaDarpan collects minimal information needed to provide our service. When you
                use our eligibility checker, your profile data (age, state, occupation, income
                range) is processed locally in your browser and is NOT stored on our servers
                unless you choose to save it for alerts.
              </p>
              <p className="mt-2">
                If you sign up for alerts, we collect your email address or WhatsApp number
                solely to send you scheme notifications.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>To match you with eligible government schemes</li>
                <li>To send scheme alerts if you subscribed</li>
                <li>To improve our service through anonymous analytics</li>
                <li>We never sell your data to third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">3. Cookies and Advertising</h2>
              <p>
                We use Google AdSense to display ads. Google may use cookies to show you
                personalized ads based on your browsing history. You can opt out at
                <a href="https://adssettings.google.com" className="text-saffron-500 ml-1" target="_blank">
                  Google Ad Settings
                </a>.
              </p>
              <p className="mt-2">
                We use Google Analytics to understand how visitors use our site. This collects
                anonymous data like page views and session duration.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">4. Data Security</h2>
              <p>
                We use Supabase (SOC2 certified) to store alert subscriber data. All connections
                are encrypted via HTTPS. We do not store sensitive personal information like
                Aadhaar numbers, bank details, or government IDs.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">5. Your Rights</h2>
              <p>
                You can request deletion of your data at any time by emailing us at
                privacy@yojanadarpan.in. We will delete your information within 7 working days.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">6. Disclaimer</h2>
              <p>
                YojanaDarpan is an independent information service. We are not affiliated with
                any government body. Scheme information may not be 100% current — always verify
                on official portals before applying.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-gray-900 mb-2">7. Contact</h2>
              <p>
                For privacy concerns: privacy@yojanadarpan.in<br />
                For general inquiries: hello@yojanadarpan.in
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
