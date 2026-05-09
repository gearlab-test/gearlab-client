import { Orbitron, Poppins } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

import Navbar from './components/Navbar';

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${poppins.variable}`}>
      <body className="font-poppins bg-background text-foreground antialiased min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-grow">

          {children}
        </main>

        <footer className="border-t border-border bg-surface py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm text-gray-500">
            <div>
              <p className="font-orbitron text-primary text-lg font-bold mb-2">GEARLAB</p>
              <p>© 2026 GearLab Industries. All rights reserved.</p>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Support</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}