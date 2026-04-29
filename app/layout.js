import { Orbitron, Poppins } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const poppins = Poppins({ subsets: ['latin'], weight: ['400','600'], variable: '--font-poppins' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${poppins.variable}`}>
      <body style={{ fontFamily: 'var(--font-poppins), sans-serif', margin: 0 }}>
        {children}
      </body>
    </html>
  );
}