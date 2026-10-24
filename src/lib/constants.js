export const STORE_CONFIG = {
  name: 'Shri Rajeshwari Crackers',
  tamilName: 'ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ்',
  tagline: 'ஸ்ரீ முருகன் துணை • Sivakasi Direct Factory Outlet',
  discountText: 'MEGA DISCOUNT 80% OFF',
  phone: '9159802698',
  phoneDisplay: '+91 91598 02698',
  secondaryPhone: '6369732737',
  secondaryPhoneDisplay: '+91 63697 32737',
  whatsappNumber: '9159802698',
  whatsappDisplay: '+91 91598 02698',
  email: 'rajeshwaricrackers@gmail.com',
  address: '12/291/1 Rathnapuri Nagar, Sivakasi, Tamil Nadu 626123',
  addressTamil: '12/291/1 ரத்தினபுரி நகர், சிவகாசி',
  googleMapsUrl: 'https://maps.google.com/?q=Sivakasi+Fireworks+Tamil+Nadu',
  tamilGreeting: 'எங்களிடம் அனைத்து வித பட்டாசுகளும் தரமானதாகவும் விலை குறைவாகவும் கிடைக்கும்',
  motto: 'ஸ்ரீ முருகன் துணை',
  visitingCardImage: '/images/visiting-card.jpg',
  logoImage: '/images/logo.png',
  features: [
    { title: 'Best Quality', subtitle: 'Premium Sivakasi Fireworks' },
    { title: 'Safe Crackers', subtitle: '100% Safe & Eco-Friendly PESO' },
    { title: 'Best Price', subtitle: 'Lowest Factory Rate (80% Off)' },
    { title: 'Wide Range', subtitle: '139+ Varieties for Celebrations' },
    { title: 'Fast Delivery', subtitle: 'Direct Express All-India Dispatch' }
  ]
};

export const MACRO_CATEGORIES = [
  { id: 'All', label: 'All Crackers', count: 139 },
  { id: 'Daylight', label: 'Daylight Crackers', description: 'Sparklers, Chakkars, Bijili, Garland & Sound', count: 52 },
  { id: 'Nightlight', label: 'Nightlight Crackers', description: 'Sky Shots, Fountains, Fancy Pipes & Mega Shows', count: 80 },
  { id: 'Gift Boxes', label: 'Gift Boxes', description: 'Complete Assorted Festive Celebration Hampers', count: 7 }
];

export const SUB_CATEGORIES = [
  'One Sound',
  'Sparklers',
  'Ground Chakkar',
  'Flower Pots',
  'Bombs',
  'Paper Bombs',
  'Rockets',
  'Marriage Series',
  'Deluxe Crackers',
  'Twinkling Star',
  'Colourful Peacock Fountain',
  'Ayyan Special Fountain',
  'Whistling Series',
  'Tri Colour Fountain',
  'Kids Collections Colourful Fountain',
  'Tin Fountain',
  'Chocolate / Night Colourful Fountain',
  'Fancy Pipe Out',
  'Night Marvels',
  'Multi Colour Shots',
  'Rider',
  'Mega Sky Show',
  'Loose Crackers',
  'Candle',
  'Colour Matches',
  'Gift Boxes'
];

export function generateWhatsAppOrderUrl({ 
  orderRef, 
  customer, 
  items, 
  totalMrp, 
  totalSavings, 
  finalAmount, 
  targetWhatsAppNumber,
  storeSettings
}) {
  const line = '----------------------------------------';
  
  // Resolve dynamic numbers and address from storeSettings or fallbacks
  const activeWa = (storeSettings?.whatsapp_number || targetWhatsAppNumber || STORE_CONFIG.whatsappNumber).replace(/[^0-9]/g, '');
  const activeSec = (storeSettings?.secondary_phone || STORE_CONFIG.secondaryPhone || '').replace(/[^0-9]/g, '');
  const activeAddr = storeSettings?.address || STORE_CONFIG.address;
  const activeName = (storeSettings?.shop_name || STORE_CONFIG.name).toUpperCase();

  let message = `✨ *${activeName} - DIWALI ORDER* ✨\n`;
  message += `*ஸ்ரீ ராஜேஸ்வரி கிராக்கர்ஸ் - 80% Mega Discount*\n`;
  message += `${line}\n`;
  message += `📋 *Order Ref:* #${orderRef}\n`;
  message += `📅 *Date:* ${new Date().toLocaleDateString('en-IN')}\n\n`;
  
  message += `👤 *CUSTOMER DETAILS:*\n`;
  message += `• *Name:* ${customer.name}\n`;
  message += `• *WhatsApp Mobile:* ${customer.phone}\n`;
  message += `• *Address:* ${customer.address}\n`;
  message += `• *City & Pincode:* ${customer.city}${customer.pincode ? ` - ${customer.pincode}` : ''}\n`;
  if (customer.notes) {
    message += `• *Note:* ${customer.notes}\n`;
  }
  message += `\n📦 *ORDERED ITEMS (${items.length} items):*\n`;
  
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    message += `${index + 1}. *${item.name}* (${item.tamilName || ''})\n`;
    message += `   Qty: ${item.quantity} ${item.unit || 'Box'} × ₹${item.price} = *₹${itemTotal.toLocaleString('en-IN')}* (MRP: ₹${(item.originalPrice * item.quantity).toLocaleString('en-IN')})\n`;
  });

  message += `\n${line}\n`;
  message += `🏷️ *Total MRP Value:* ₹${totalMrp.toLocaleString('en-IN')}\n`;
  message += `🎉 *Mega Discount (80% Off):* -₹${totalSavings.toLocaleString('en-IN')}\n`;
  message += `💰 *FINAL NET PAYABLE: ₹${finalAmount.toLocaleString('en-IN')}*\n`;
  message += `${line}\n`;
  message += `📍 *Direct Factory:* ${activeAddr}\n`;
  
  const contactsDisplay = activeSec 
    ? `+91 ${activeWa} / +91 ${activeSec}` 
    : `+91 ${activeWa}`;
  message += `📞 *Store Contacts:* ${contactsDisplay}\n`;
  message += `🙏 *Thank you! Please verify and confirm this order.*`;

  const cleanNumber = activeWa.startsWith('91') && activeWa.length === 12 
    ? activeWa 
    : (activeWa.length === 10 ? `91${activeWa}` : activeWa);

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
