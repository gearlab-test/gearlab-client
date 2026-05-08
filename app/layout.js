import { Orbitron, Poppins } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${poppins.variable}`}>
      <body className="font-poppins bg-background text-foreground antialiased min-h-screen flex flex-col">
        <nav className="glass sticky top-0 z-50 border-b border-border">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="font-orbitron text-2xl font-bold text-primary tracking-tighter hover:opacity-80 transition-opacity">
              GEARLAB
            </Link>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/category" className="hover:text-primary transition-colors">Vehicles</Link>
              <Link href="/cart" className="hover:text-primary transition-colors">Cart</Link>
              <Link href="/auth/login" className="px-5 py-2 rounded-full border border-primary text-primary hover:bg-primary hover:text-background transition-all">
                Login
              </Link>
            </div>
          </div>
        </nav>

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