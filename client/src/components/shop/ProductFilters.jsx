import Button from '../ui/Button';

const ProductFilters = ({ filters, categories, onChange, onReset }) => (
  <div className="glass-card p-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">Filter collection</p>
        <h3 className="mt-2 font-display text-2xl font-bold text-coal-900">Find the right festive products faster</h3>
      </div>
      <Button onClick={onReset} type="button" variant="ghost">
        Reset filters
      </Button>
    </div>

    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <label>
        <span className="label">Search</span>
        <input
          className="input"
          name="search"
          onChange={onChange}
          placeholder="Search crackers"
          value={filters.search}
        />
      </label>

      <label>
        <span className="label">Category</span>
        <select className="input" name="category" onChange={onChange} value={filters.category}>
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="label">Sort by</span>
        <select className="input" name="sort" onChange={onChange} value={filters.sort}>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="stock">Most stocked</option>
        </select>
      </label>

      <label>
        <span className="label">Min price</span>
        <input className="input" name="minPrice" onChange={onChange} type="number" value={filters.minPrice} />
      </label>

      <label>
        <span className="label">Max price</span>
        <input className="input" name="maxPrice" onChange={onChange} type="number" value={filters.maxPrice} />
      </label>
    </div>
  </div>
);

export default ProductFilters;
