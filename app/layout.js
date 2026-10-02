import { Orbitron, Poppins } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ScrollToTop from './components/ScrollToTop';

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });

export const metadata = {
  title: 'GearLab — Vehicle Customization & Maintenance',
  description: 'Premium vehicle customization, servicing, and performance engineering. Configure, customize, and book certified workshop appointments.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${orbitron.variable} ${poppins.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('gearlab-theme');
                  var theme = saved || 'dark';
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-poppins bg-background text-foreground antialiased min-h-screen flex flex-col transition-colors duration-300">
        <Navbar />
        <Toast />

        <main className="flex-grow">
          {children}
        </main>

        {/* ━━━ FOOTER ━━━ */}
        <footer className="relative overflow-hidden border-t border-white/[0.03] bg-[#050505]">
          {/* Ambient glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-40 glow-orb-primary rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

              {/* Brand */}
              <div className="space-y-4">
                <Link href="/" className="font-orbitron text-xl font-bold tracking-tight inline-flex items-center gap-1.5 group">
                  <span className="text-primary group-hover:drop-shadow-[0_0_8px_rgba(0,255,136,0.3)] transition-all duration-500">GEAR</span>
                  <span className="text-white">LAB</span>
                </Link>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Premium vehicle customization, servicing, and performance engineering. Built for the bold.
                </p>
                <div className="flex gap-2.5 pt-1">
                  {[
                    { label: 'GitHub', href: '#', icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    )},
                    { label: 'Twitter', href: '#', icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    )},
                    { label: 'Instagram', href: '#', icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    )},
                    { label: 'LinkedIn', href: '#', icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    )},
                  ].map(({ label, href, icon }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary/15 hover:bg-primary/[0.03] transition-all duration-400 hover:scale-110"
                    >
                      {icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500 mb-5">Quick Links</h4>
                <ul className="space-y-3">
                  {[
                    { label: 'Browse Vehicles', href: '/category' },
                    { label: 'Bikes Collection', href: '/vehicles?type=bike' },
                    { label: 'Cars Collection', href: '/vehicles?type=car' },
                    { label: 'Your Cart', href: '/cart' },
                    { label: 'Your Profile', href: '/profile' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-gray-600 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500 mb-5">Support</h4>
                <ul className="space-y-3">
                  {[
                    { label: 'Contact Us', href: '#' },
                    { label: 'FAQ', href: '#' },
                    { label: 'Terms of Service', href: '#' },
                    { label: 'Privacy Policy', href: '#' },
                    { label: 'Workshop Registration', href: '/auth/register' },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="text-sm text-gray-600 hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500 mb-5">Stay Updated</h4>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">Get the latest on new vehicles, services, and exclusive offers.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    className="flex-1 bg-white/[0.02] border border-white/[0.04] rounded-lg py-2.5 px-4 text-sm text-white placeholder-gray-600 focus:border-primary/30 outline-none transition-all duration-400"
                  />
                  <button className="px-4 py-2.5 bg-primary text-background font-bold text-xs rounded-lg hover:shadow-[0_0_16px_rgba(0,255,136,0.2)] active:scale-95 transition-all duration-300 magnetic-btn">
                    Go
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-6" />

            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-600">
              <p>&copy; 2026 GearLab Industries. All rights reserved.</p>
              <p className="text-gray-700 tracking-wider">
                Engineered with precision. Built with passion.
              </p>
            </div>
          </div>
        </footer>

        <ScrollToTop />
      </body>
    </html>
  );
}