import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { api } from '../api'
import ProductCard from '../components/shop/ProductCard'
import ProductFilters from '../components/shop/ProductFilters'
import EmptyState from '../components/ui/EmptyState'
import Loader from '../components/ui/Loader'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { STORE_INFO } from '../lib/config'

const getInitialFilters = (searchParams) => ({
  search: searchParams.get('search') || '',
  category: searchParams.get('category') || '',
  sort: searchParams.get('sort') || 'latest',
  minPrice: searchParams.get('minPrice') || '',
  maxPrice: searchParams.get('maxPrice') || '',
})

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(getInitialFilters(searchParams))
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setFilters(getInitialFilters(searchParams))
  }, [searchParams])

  useEffect(() => {
    const loadCatalog = async () => {
      setLoading(true)
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts({
            ...filters,
            page,
          }),
          api.getCategories(),
        ])
        setProducts(productsData.products)
        setPagination(productsData.pagination)
        setCategories(categoriesData.categories)
      } finally {
        setLoading(false)
      }
    }

    loadCatalog()
  }, [filters, page])

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    const nextFilters = {
      ...filters,
      [name]: value,
    }
    setPage(1)
    setSearchParams(
      Object.fromEntries(Object.entries(nextFilters).filter(([, entryValue]) => entryValue)),
    )
  }

  const handleReset = () => {
    setPage(1)
    setSearchParams({})
  }

  return (
    <div className="shell py-12">
      <div className="page-banner p-8 sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            description={`Browse premium cracker categories from ${STORE_INFO.address}, compare prices, and add products to your cart with real stock visibility.`}
            eyebrow={STORE_INFO.name}
            title="Shop the full crackers collection"
          />
          <Button as="div" className="cursor-default" variant="soft">
            Live filters and category search
          </Button>
        </div>
      </div>

      <div className="mt-8">
        <ProductFilters categories={categories} filters={filters} onChange={handleFilterChange} onReset={handleReset} />
      </div>

      {loading ? (
        <Loader label="Loading products..." />
      ) : products.length ? (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="mt-10 flex items-center justify-between">
            <p className="text-sm text-coal-600">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-3">
              <Button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} variant="soft">
                Previous
              </Button>
              <Button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
                variant="accent"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-10">
          <EmptyState
            action={
              <Button onClick={handleReset} variant="accent">
                Clear filters
              </Button>
            }
            description="No crackers matched your current search. Try a different category or reset the filters."
            title="No products found"
          />
        </div>
      )}
    </div>
  )
}

export default ShopPage
