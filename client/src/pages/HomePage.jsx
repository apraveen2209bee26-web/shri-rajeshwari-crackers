import {
  ArrowRight,
  BadgePercent,
  CheckCircle2,
  Gift,
  Mail,
  MapPin,
  Moon,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  Truck,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../api'
import allTypeImage from '../assets/reference/home.webp'
import bannerImage from '../assets/reference/banner.jpeg'
import heroImage from '../assets/illustration-diwali-crackers.avif'
import sakkaramImage from '../assets/reference/sakkaram.jpeg'
import ProductCard from '../components/shop/ProductCard'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import SectionHeading from '../components/ui/SectionHeading'
import { STORE_INFO } from '../lib/config'

const heroSlides = [
  {
    image: bannerImage,
    label: 'Mega sale banner',
  },
  {
    image: allTypeImage,
    label: 'All type crackers',
  },
  {
    image: heroImage,
    label: 'Celebration crackers',
  },
]

const collectionTabs = [
  {
    id: 'day',
    label: 'Day Time',
    icon: Sun,
    matches: ['sparklers', 'ground', 'fountains', 'kids', 'chakkar'],
  },
  {
    id: 'night',
    label: 'Night Time',
    icon: Moon,
    matches: ['rockets', 'aerial', 'sky', 'night'],
  },
  {
    id: 'gift',
    label: 'Gift Box',
    icon: Gift,
    matches: ['gift', 'festival', 'combo', 'box'],
  },
]

const saleStats = [
  ['250+', 'Products Available'],
  ['5000+', 'Happy Customers'],
  ['1200+', 'Orders Delivered'],
  ['24/7', 'Customer Support'],
]

const qualityStats = [
  {
    icon: Star,
    title: 'Customers Satisfaction',
    value: '99%',
  },
  {
    icon: ShieldCheck,
    title: 'Quality of Service',
    value: '99%',
  },
  {
    icon: CheckCircle2,
    title: 'Quality Crackers',
    value: '99%',
  },
  {
    icon: ShoppingBag,
    title: 'Available Products',
    value: '250',
  },
]

const servicePoints = [
  {
    icon: ShieldCheck,
    title: 'Quality checked crackers',
    description: 'Seasonal products are presented with stock visibility, sale pricing, and clear pack details.',
  },
  {
    icon: Truck,
    title: 'Order support',
    description: 'Customers can place orders through the catalog, track their order history, and contact the shop directly.',
  },
  {
    icon: BadgePercent,
    title: 'Diwali offers',
    description: 'Mega sale highlights keep the reference offer front and center across the storefront.',
  },
]

const getCollectionProducts = (products, activeCollection) => {
  const activeTab = collectionTabs.find((tab) => tab.id === activeCollection)

  if (!activeTab) {
    return products
  }

  const matchingProducts = products.filter((product) => {
    const searchableCategories = product.categories?.map((category) => category.toLowerCase()) || []
    const searchableText = `${product.name || ''} ${product.shortDescription || ''}`.toLowerCase()

    return activeTab.matches.some((match) =>
      searchableCategories.some((category) => category.includes(match)) || searchableText.includes(match),
    )
  })

  return matchingProducts.length ? matchingProducts : products
}

const HomePage = () => {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [activeCollection, setActiveCollection] = useState('day')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const featured = await api.getFeaturedProducts()
        setFeaturedProducts(featured.products || [])
      } finally {
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [])

  const currentSlide = heroSlides[activeSlide]
  const visibleProducts = getCollectionProducts(featuredProducts, activeCollection).slice(0, 4)

  const handleSearchSubmit = (event) => {
    event.preventDefault()

    const nextSearch = search.trim()
    navigate(nextSearch ? `/shop?search=${encodeURIComponent(nextSearch)}` : '/shop')
  }

  return (
    <div>
      <section className="relative isolate overflow-hidden bg-coal-900 text-white">
        <img
          key={currentSlide.image}
          alt={currentSlide.label}
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700"
          src={currentSlide.image}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-coal-900/90 via-coal-900/70 to-[#ff0019]/30" />
        <div className="shell relative py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-100">
              <Sparkles className="h-4 w-4" />
              100% Satisfaction
            </span>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-none text-white [text-shadow:2px_2px_8px_rgba(255,0,25,0.72)] sm:text-6xl lg:text-7xl">
              {STORE_INFO.name}
            </h1>
            <p className="mt-5 max-w-2xl font-display text-3xl font-extrabold leading-tight text-amber-100 [text-shadow:2px_2px_5px_rgba(255,0,25,0.72)] sm:text-4xl">
              Quality Crackers & Affordable Price
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
              Visit us at {STORE_INFO.address}. For orders and support, call {STORE_INFO.phone}.
            </p>

            <form className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row" onSubmit={handleSearchSubmit}>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ff0019]" />
                <input
                  className="h-14 w-full rounded-full border-2 border-[#ff0019] bg-white px-12 text-sm font-semibold text-coal-900 outline-none transition focus:ring-4 focus:ring-white/25"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search crackers"
                  value={search}
                />
              </div>
              <Button className="h-14 px-7" type="submit" variant="accent">
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/shop" variant="accent">
                Shop Now
              </Button>
              <Button as="a" href={`tel:${STORE_INFO.phoneRaw}`} variant="soft">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </div>
          </div>

          <div className="mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
            {heroSlides.map((slide, index) => (
              <button
                aria-label={`Show ${slide.label}`}
                className={`h-24 overflow-hidden rounded-2xl border-2 transition ${activeSlide === index ? 'border-white shadow-glow' : 'border-white/30 opacity-75 hover:opacity-100'
                  }`}
                key={slide.label}
                onClick={() => setActiveSlide(index)}
                type="button"
              >
                <img alt="" className="h-full w-full object-cover" src={slide.image} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="shell relative z-10 -mt-10">
        <div className="festival-offer-card">
          <Sparkles className="festival-spark left-5 top-5" />
          <Sparkles className="festival-spark right-5 top-5" />
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#ff0019]">Festival Offer</p>
          <h2 className="mt-3 font-display text-4xl font-extrabold text-[#ff0019] sm:text-5xl">Diwali Mega Sale</h2>
          <p className="mt-4 text-xl font-semibold text-coal-800 sm:text-2xl">
            Up To <span className="font-extrabold text-[#ff0019]">70% OFF</span> On All Crackers
          </p>
          <Button as={Link} className="mt-6" to="/shop" variant="accent">
            Shop Now
          </Button>
        </div>
      </section>

      <section className="shell mt-10">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {saleStats.map(([value, label]) => (
            <div className="stat-box" key={label}>
              <p className="font-display text-4xl font-extrabold text-[#ff0019]">{value}</p>
              <p className="mt-2 text-sm font-bold text-coal-800">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-space pt-14">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="font-display text-4xl font-extrabold text-coal-900 sm:text-5xl">
              Crackers Collection
            </h2>
            <div className="flex flex-wrap gap-3">
              {collectionTabs.map((tab) => {
                const Icon = tab.icon

                return (
                  <button
                    className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-3 text-sm font-bold transition ${activeCollection === tab.id
                      ? 'border-[#ff0019] bg-[#ff0019] text-white shadow-glow'
                      : 'border-amber-100 bg-white text-coal-700 hover:border-[#ff0019] hover:text-[#ff0019]'
                      }`}
                    key={tab.id}
                    onClick={() => setActiveCollection(tab.id)}
                    type="button"
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-10">
            {loading ? (
              <Loader label="Loading crackers..." />
            ) : visibleProducts.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-festive">
                <h3 className="font-display text-2xl font-bold text-coal-900">Products will appear here soon.</h3>
                <p className="mt-3 text-sm leading-7 text-coal-700">
                  The Sri Rajeswari Crackers catalog is ready for live products from the admin panel.
                </p>
              </div>
            )}
          </div>

          <div className="mt-10 text-center">
            <Button as={Link} className="px-8 py-4 text-base" to="/cart" variant="accent">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Place Order
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="shell">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {qualityStats.map((item) => {
              const Icon = item.icon

              return (
                <div className="rounded-2xl bg-amber-50 p-7 text-center shadow-festive" key={item.title}>
                  <Icon className="mx-auto h-8 w-8 text-coal-900" />
                  <p className="mt-5 text-sm font-bold uppercase tracking-[0.13em] text-coal-700">{item.title}</p>
                  <p className="mt-3 font-display text-4xl font-extrabold text-[#ff0019]">{item.value}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-space">
        <div className="shell">
          <SectionHeading
            description="Shop directly from the festive catalog, review stock availability, and place your order with Sri Rajeswari Crackers."
            eyebrow="Shop Info"
            title="Quality crackers, trusted service, and direct customer support."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {servicePoints.map((point) => {
              const Icon = point.icon

              return (
                <article className="rounded-2xl border border-amber-100 bg-white p-7 shadow-festive" key={point.title}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff0019] text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-coal-900">{point.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-coal-700">{point.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="shell pb-16" id="contact">
        <div className="grid overflow-hidden rounded-2xl border border-ember-100 bg-white shadow-festive lg:grid-cols-[0.9fr_1.1fr]">
          <img alt="Sri Rajeswari Crackers collection" className="h-full min-h-[320px] w-full object-cover" src={sakkaramImage} />
          <div className="p-7 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff0019]">Contact</p>
            <h2 className="mt-3 font-display text-4xl font-extrabold text-coal-900">Sri Rajeswari Crackers, 12/291/1 Rathnapuri Nagar, Sivakasi</h2>
            <div className="mt-8 grid gap-4 text-sm font-semibold text-coal-700">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#ff0019]" />
                Address: {STORE_INFO.address}
              </p>
              <a className="flex items-center gap-3 transition hover:text-[#ff0019]" href={`tel:${STORE_INFO.phoneRaw}`}>
                <Phone className="h-5 w-5 text-[#ff0019]" />
                Phone: {STORE_INFO.phone}
              </a>
              <a className="flex items-center gap-3 transition hover:text-[#ff0019]" href={`mailto:${STORE_INFO.email}`}>
                <Mail className="h-5 w-5 text-[#ff0019]" />
                Email: {STORE_INFO.email}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as="a" href={STORE_INFO.whatsappUrl} target="_blank" rel="noreferrer" variant="accent">
                WhatsApp Order
              </Button>
              <Button as={Link} to="/shop" variant="ghost">
                Browse Catalog
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
