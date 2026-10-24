export const API_BASE_URL =
  import.meta.env?.PUBLIC_API_BASE_URL || '/api'

export const APP_NAME = 'Sri Rajeswari Crackers'

export const STORE_INFO = {
  name: APP_NAME,
  location: '12/291/1 Rathnapuri Nagar, Sivakasi',
  address: 'Sri Rajeswari Crackers, 12/291/1 Rathnapuri Nagar, Sivakasi',
  email: 'rajesht16042004@gmail.com',
  phone: '+91 6369732737',
  phoneRaw: '916369732737',
  whatsappUrl: 'https://wa.me/916369732737',
  tamilGreeting: 'உங்களுக்கும் உங்கள் குடும்பத்திற்கும் இனிய தீபாவளி நல்வாழ்த்துக்கள்',
}

export const ORDER_STATUS_STYLES = {
  created: 'border border-amber-200 bg-amber-100 text-amber-900',
  paid: 'border border-emerald-200 bg-emerald-100 text-emerald-900',
  processing: 'border border-orange-200 bg-orange-100 text-orange-900',
  shipped: 'border border-sky-200 bg-sky-100 text-sky-900',
  delivered: 'border border-emerald-200 bg-emerald-100 text-emerald-900',
  cancelled: 'border border-rose-200 bg-rose-100 text-rose-900',
}
