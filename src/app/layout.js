import { Outfit, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import { ToastProvider } from '@/components/Toast';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-source-serif',
  display: 'swap',
});

export const metadata = {
  title: 'ClearClaim Medical Billing | Professional RCM Services',
  description: 'ClearClaim handles your complete medical billing workflow — from insurance verification and coding to claim submission, denial management, and payment posting.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${sourceSerif.variable}`}>
      <body>
        <ToastProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
