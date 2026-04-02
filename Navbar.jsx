'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Bell, Globe } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/find', label: 'Find Schemes' },
  { href: '/schemes', label: 'All Schemes' },
  { href: '/states', label: 'States' },
  { href: '/blog', label: 'News' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-saffron-500 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Yojana<span className="text-saffron-500">Darpan</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="flex items-center gap-1 text-sm text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-100">
              <Globe className="w-3.5 h-3.5" />
              EN / हिं
            </button>
            <Link
              href="/find"
              className="flex items-center gap-1 bg-saffron-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-saffron-600 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              Get Free Alerts
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-gray-500"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm text-gray-700 hover:text-saffron-500"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/find"
              onClick={() => setOpen(false)}
              className="mt-3 block text-center bg-saffron-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg"
            >
              Find My Schemes →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
