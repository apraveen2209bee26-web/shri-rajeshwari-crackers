import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CheckoutModal from '@/components/cart/CheckoutModal';
import FloatingCartButton from '@/components/cart/FloatingCartButton';

export const metadata = {
  title: 'Shri Rajeshwari Crackers | Sivakasi Crackers Online | 80% Mega Discount',
  description: 'Buy premium Sivakasi crackers directly from Shri Rajeshwari Crackers (ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ்) with 80% Mega Discount. 12/291/1 Rathnapuri Nagar, Sivakasi. Quick WhatsApp order fulfillment to 9159802698 & 6369732737.',
  keywords: 'Shri Rajeshwari Crackers, ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ், Sivakasi crackers, diwali crackers online, buy crackers sivakasi, 80 percent discount crackers, gift boxes crackers, daylight crackers, nightlight crackers',
  authors: [{ name: 'Shri Rajeshwari Crackers' }],
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0284c7',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <CheckoutModal />
          <FloatingCartButton />
        </CartProvider>
      </body>
    </html>
  );
}
