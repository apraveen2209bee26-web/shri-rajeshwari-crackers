const calculateCartSummary = (cart) => {
  if (!cart?.items?.length) {
    return {
      items: [],
      itemCount: 0,
      subtotal: 0,
      shippingFee: 0,
      tax: 0,
      total: 0,
    };
  }

  const items = cart.items
    .filter((item) => item.product)
    .map((item) => {
      const unitPrice = item.product.price;
      const subtotal = unitPrice * item.quantity;

      return {
        productId: item.product._id,
        name: item.product.name,
        slug: item.product.slug,
        image: item.product.image,
        categories: item.product.categories,
        price: unitPrice,
        originalPrice: item.product.originalPrice || unitPrice,
        quantity: item.quantity,
        stock: item.product.stock,
        subtotal,
      };
    });

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = subtotal >= 3000 || subtotal === 0 ? 0 : 150;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shippingFee + tax;

  return {
    items,
    itemCount,
    subtotal,
    shippingFee,
    tax,
    total,
  };
};

export { calculateCartSummary };

