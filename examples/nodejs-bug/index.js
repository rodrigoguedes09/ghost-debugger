function applyDiscount(price, discountCode) {
  const discounts = {
    'SAVE10': 0.10,
    'SAVE20': 0.20,
    'SAVE30': 0.30
  };

  if (!discounts[discountCode]) {
    console.warn(`Invalid discount code: ${discountCode}. Applying no discount.`);
    return price;
  }

  return price * (1 - discounts[discountCode]);
}