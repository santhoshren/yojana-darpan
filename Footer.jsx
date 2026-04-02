import Link from 'next/link';

const popularSchemes = [
  { name: 'PM Kisan Samman Nidhi', slug: 'pm-kisan-samman-nidhi' },
  { name: 'PM Awas Yojana', slug: 'pm-awas-yojana-urban' },
  { name: 'PM Mudra Yojana', slug: 'pm-mudra-yojana-tarun' },
  { name: 'Ayushman Bharat', slug: 'ayushman-bharat-pmjay' },
  { name: 'NSP Scholarship', slug: 'nsp-post-matric-scholarship' },
  { name: 'PM Ujjwala Yojana', slug: 'pm-ujjwala-yojana' },
];

const states = [
  'Andhra Pradesh', 'Maharashtra', 'Tamil Nadu',
  'Uttar Pradesh', 'Telangana', 'Karnataka',
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-saffron-500 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3v18M3 12h18" />
                </svg>
              </div>
              <span className="text-white font-semibold">YojanaDarpan</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              India's most comprehensive government scheme eligibility finder.
              Free forever. Covers all 28 states and Union Territories.
            </p>
            <div className="flex gap-3 mt-4">
              {['Facebook', 'Twitter', 'WhatsApp'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Popular Schemes */}
          <div>
            <h4 className="text-white text-sm font-medium mb-3">Popular Schemes</h4>
            {popularSchemes.map((s) => (
              <Link
                key={s.slug}
                href={`/schemes/${s.slug}`}
                className="block text-sm text-gray-400 hover:text-white mb-2 transition-colors"
              >
                {s.name}
              </Link>
            ))}
          </div>

          {/* States */}
          <div>
            <h4 className="text-white text-sm font-medium mb-3">States</h4>
            {states.map((s) => (
              <Link
                key={s}
                href={`/states/${s.toLowerCase().replace(/ /g, '-')}`}
                className="block text-sm text-gray-400 hover:text-white mb-2 transition-colors"
              >
                {s}
              </Link>
            ))}
            <Link href="/states" className="block text-sm text-saffron-400 hover:text-saffron-300 mt-1">
              View all states →
            </Link>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm font-medium mb-3">Company</h4>
            {['About', 'Contact', 'Privacy Policy', 'Terms of Use', 'Advertise with Us', 'Sitemap'].map((l) => (
              <Link
                key={l}
                href={`/${l.toLowerCase().replace(/ /g, '-')}`}
                className="block text-sm text-gray-400 hover:text-white mb-2 transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © 2024 YojanaDarpan. Not affiliated with Government of India.
          </p>
          <p className="text-xs text-gray-500">
            Data sourced from official government portals · Updated daily
          </p>
        </div>
      </div>
    </footer>
  );
}
