import { AlertTriangle, Boxes, Plus, RefreshCcw, Trash2, WandSparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { api } from '../../api';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import { formatCurrency } from '../../lib/utils';

const createEmptySpecification = () => ({
  label: '',
  value: '',
});

const createEmptyForm = () => ({
  name: '',
  categories: '',
  tags: '',
  highlights: '',
  specifications: [createEmptySpecification()],
  shortDescription: '',
  description: '',
  price: '',
  originalPrice: '',
  stock: '',
  minOrderQuantity: 1,
  featured: false,
  status: 'active',
  imageUrl: '',
  imageFile: null,
});

const mapProductToForm = (product) => ({
  name: product.name || '',
  categories: product.categories?.join(', ') || '',
  tags: product.tags?.join(', ') || '',
  highlights: product.highlights?.join(', ') || '',
  specifications:
    product.specifications?.length > 0 ? product.specifications : [createEmptySpecification()],
  shortDescription: product.shortDescription || '',
  description: product.description || '',
  price: product.price || '',
  originalPrice: product.originalPrice || '',
  stock: product.stock || '',
  minOrderQuantity: product.minOrderQuantity || 1,
  featured: Boolean(product.featured),
  status: product.status || 'active',
  imageUrl: product.image?.url || '',
  imageFile: null,
});

const buildProductFormData = (form) => {
  const payload = new FormData();

  Object.entries(form).forEach(([key, value]) => {
    if (key === 'imageFile') {
      if (value) {
        payload.append('image', value);
      }
      return;
    }

    if (typeof value === 'boolean') {
      payload.append(key, String(value));
      return;
    }

    if (key === 'specifications') {
      payload.append(
        'specifications',
        JSON.stringify(value.filter((entry) => entry.label.trim() && entry.value.trim())),
      );
      return;
    }

    if (value !== '' && value !== null && value !== undefined) {
      payload.append(key, value);
    }
  });

  return payload;
};

const buildSkuPreview = (name) => {
  const base = name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .split('-')
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part.slice(0, 3))
    .join('');

  return `CRK-${base || 'ITEM'}-001`;
};

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [stockDrafts, setStockDrafts] = useState({});
  const [form, setForm] = useState(createEmptyForm());
  const [editingProductId, setEditingProductId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStockId, setUpdatingStockId] = useState(null);

  const editingProduct = useMemo(
    () => products.find((product) => product._id === editingProductId) || null,
    [products, editingProductId],
  );

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStock();
      setProducts(data.products);
      setStockDrafts(
        data.products.reduce((accumulator, product) => {
          accumulator[product._id] = String(product.stock ?? 0);
          return accumulator;
        }, {}),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingProductId(null);
  };

  const handleFieldChange = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSpecificationChange = (index, key, value) => {
    setForm((current) => ({
      ...current,
      specifications: current.specifications.map((specification, specificationIndex) =>
        specificationIndex === index ? { ...specification, [key]: value } : specification,
      ),
    }));
  };

  const addSpecificationRow = () => {
    setForm((current) => ({
      ...current,
      specifications: [...current.specifications, createEmptySpecification()],
    }));
  };

  const removeSpecificationRow = (index) => {
    setForm((current) => ({
      ...current,
      specifications:
        current.specifications.length === 1
          ? [createEmptySpecification()]
          : current.specifications.filter((_, specificationIndex) => specificationIndex !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = buildProductFormData(form);
      if (editingProductId) {
        await api.updateStockItem(editingProductId, payload);
        toast.success('Stock item details updated successfully');
      } else {
        await api.createStockItem(payload);
        toast.success('New stock item created successfully');
      }
      await loadProducts();
      resetForm();
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setForm(mapProductToForm(product));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) {
      return;
    }

    await api.deleteStockItem(productId);
    toast.success('Stock item deleted successfully');
    await loadProducts();
    if (editingProductId === productId) {
      resetForm();
    }
  };

  const handleStockDraftChange = (productId, value) => {
    setStockDrafts((current) => ({
      ...current,
      [productId]: value,
    }));
  };

  const handleQuickStockUpdate = async (productId) => {
    const nextStock = Number(stockDrafts[productId]);

    if (Number.isNaN(nextStock) || nextStock < 0) {
      toast.error('Enter a valid stock quantity');
      return;
    }

    setUpdatingStockId(productId);
    try {
      const data = await api.updateStockQuantity(productId, { stock: nextStock });
      toast.success(data.message);
      await loadProducts();
    } finally {
      setUpdatingStockId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">
              {editingProduct ? 'Update stock details' : 'Create stock item'}
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-coal-900">
              {editingProduct ? `Editing ${editingProduct.name}` : 'Add a new cracker product'}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-coal-700">
              SKU is created automatically when the item is first saved. Specifications are now added
              as normal label and value rows instead of raw JSON.
            </p>
          </div>
          {editingProduct ? (
            <Button onClick={resetForm} variant="ghost">
              Cancel edit
            </Button>
          ) : null}
        </div>

        <div className="mt-6 rounded-[24px] border border-dashed border-ember-200 bg-amber-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember-700">
            Auto SKU preview
          </p>
          <p className="mt-2 font-display text-2xl font-bold text-coal-900">
            {editingProduct?.sku || buildSkuPreview(form.name)}
          </p>
          <p className="mt-2 text-sm text-coal-700">
            The final SKU is generated on the server and stays stable for existing items.
          </p>
        </div>

        <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="sm:col-span-2">
            <span className="label">Product name</span>
            <input className="input" onChange={(event) => handleFieldChange('name', event.target.value)} required value={form.name} />
          </label>
          <label className="sm:col-span-2">
            <span className="label">Categories</span>
            <input
              className="input"
              onChange={(event) => handleFieldChange('categories', event.target.value)}
              placeholder="Gift Boxes, Rockets"
              value={form.categories}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="label">Short description</span>
            <input
              className="input"
              onChange={(event) => handleFieldChange('shortDescription', event.target.value)}
              required
              value={form.shortDescription}
            />
          </label>
          <label className="sm:col-span-2">
            <span className="label">Description</span>
            <textarea
              className="input min-h-32 resize-y"
              onChange={(event) => handleFieldChange('description', event.target.value)}
              required
              value={form.description}
            />
          </label>
          <label>
            <span className="label">Price</span>
            <input className="input" min="0" onChange={(event) => handleFieldChange('price', event.target.value)} required type="number" value={form.price} />
          </label>
          <label>
            <span className="label">Original price</span>
            <input className="input" min="0" onChange={(event) => handleFieldChange('originalPrice', event.target.value)} type="number" value={form.originalPrice} />
          </label>
          <label>
            <span className="label">Initial stock</span>
            <input className="input" min="0" onChange={(event) => handleFieldChange('stock', event.target.value)} required type="number" value={form.stock} />
          </label>
          <label>
            <span className="label">Minimum order quantity</span>
            <input
              className="input"
              min="1"
              onChange={(event) => handleFieldChange('minOrderQuantity', event.target.value)}
              type="number"
              value={form.minOrderQuantity}
            />
          </label>
          <label>
            <span className="label">Tags</span>
            <input className="input" onChange={(event) => handleFieldChange('tags', event.target.value)} placeholder="premium, family, festival" value={form.tags} />
          </label>
          <label>
            <span className="label">Highlights</span>
            <input
              className="input"
              onChange={(event) => handleFieldChange('highlights', event.target.value)}
              placeholder="Bright fountains, long duration"
              value={form.highlights}
            />
          </label>
          <div className="sm:col-span-2 rounded-[28px] border border-ember-100 bg-white/70 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">
                  Specifications
                </p>
                <p className="mt-2 text-sm text-coal-700">
                  Add simple label and value pairs like `Pack size` and `24 pieces`.
                </p>
              </div>
              <Button onClick={addSpecificationRow} variant="soft">
                <Plus className="mr-2 h-4 w-4" />
                Add row
              </Button>
            </div>

            <div className="mt-5 space-y-3">
              {form.specifications.map((specification, index) => (
                <div key={`${specification.label}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                  <input
                    className="input"
                    onChange={(event) => handleSpecificationChange(index, 'label', event.target.value)}
                    placeholder="Label"
                    value={specification.label}
                  />
                  <input
                    className="input"
                    onChange={(event) => handleSpecificationChange(index, 'value', event.target.value)}
                    placeholder="Value"
                    value={specification.value}
                  />
                  <Button onClick={() => removeSpecificationRow(index)} variant="ghost">
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <label>
            <span className="label">Image URL</span>
            <input className="input" onChange={(event) => handleFieldChange('imageUrl', event.target.value)} placeholder="Optional if you are uploading a file" value={form.imageUrl} />
          </label>
          <label>
            <span className="label">Upload image</span>
            <input
              className="input file:mr-4 file:rounded-full file:border-0 file:bg-ember-500 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
              onChange={(event) => handleFieldChange('imageFile', event.target.files?.[0] || null)}
              type="file"
            />
          </label>
          <label>
            <span className="label">Status</span>
            <select className="input" onChange={(event) => handleFieldChange('status', event.target.value)} value={form.status}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="flex items-end gap-3 rounded-[24px] border border-ember-100 bg-white/70 px-4 py-3">
            <input
              checked={form.featured}
              onChange={(event) => handleFieldChange('featured', event.target.checked)}
              type="checkbox"
            />
            <span className="text-sm font-semibold text-coal-800">Mark as featured on landing page</span>
          </label>

          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <Button disabled={submitting} type="submit" variant="accent">
              {submitting
                ? editingProduct
                  ? 'Updating stock item...'
                  : 'Creating stock item...'
                : editingProduct
                  ? 'Update stock details'
                  : 'Create stock item'}
            </Button>
            <Button onClick={resetForm} variant="soft">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset form
            </Button>
          </div>
        </form>
      </div>

      <section className="glass-card p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-ember-700">
              Update existing stock
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-coal-900">
              Current inventory list
            </h2>
          </div>
          <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-coal-700">
            Quick stock quantity update uses a dedicated route now.
          </div>
        </div>

        {loading ? (
          <Loader label="Loading stock items..." />
        ) : (
          <div className="mt-6 space-y-4">
            {products.map((product) => (
              <div key={product._id} className="rounded-[24px] bg-amber-50 p-5">
                <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="flex items-start gap-4">
                    <img alt={product.name} className="h-24 w-24 rounded-[24px] object-cover" src={product.image?.url} />
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-display text-2xl font-bold text-coal-900">{product.name}</p>
                        {product.stock <= 10 ? (
                          <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase text-rose-700">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Low stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700">
                            <Boxes className="mr-1 h-3 w-3" />
                            In stock
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-coal-600">
                        {product.sku} - {product.categories?.join(', ')}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-coal-800">
                        {formatCurrency(product.price)} - Current stock {product.stock}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-white/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-ember-700">
                      Stock quantity
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <input
                        className="input min-w-[130px] flex-1"
                        min="0"
                        onChange={(event) => handleStockDraftChange(product._id, event.target.value)}
                        type="number"
                        value={stockDrafts[product._id] ?? ''}
                      />
                      <Button
                        disabled={updatingStockId === product._id}
                        onClick={() => handleQuickStockUpdate(product._id)}
                        variant="accent"
                      >
                        {updatingStockId === product._id ? 'Saving...' : 'Update quantity'}
                      </Button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button onClick={() => handleEdit(product)} variant="soft">
                        <WandSparkles className="mr-2 h-4 w-4" />
                        Edit details
                      </Button>
                      <Button onClick={() => handleDelete(product._id)} variant="danger">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminProductsPage;
