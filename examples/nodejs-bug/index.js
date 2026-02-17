function calculateTotal(items) {
  let total = 0;
  
  for (const item of items) {
    total += item.price * item.quantity;
  }
  
  return total;
}

function applyDiscount(total, discountCode) {
  const discounts = {
    'SAVE10': 0.10,
    'SAVE20': 0.20,
    'SAVE30': 0.30,
  };
  
  // Return original price if discount code is invalid
  if (!discounts[discountCode]) {
    console.warn(`Invalid discount code: ${discountCode}. Applying no discount.`);
    return total;
  }
  
  const discountAmount = total * discounts[discountCode];
  return total - discountAmount;
}

const cart = [
  { name: 'Widget', price: 10.99, quantity: 2 },
  { name: 'Gadget', price: 25.50, quantity: 1 },
];

const total = calculateTotal(cart);
console.log('Total:', total);

const finalPrice = applyDiscount(total, 'INVALID_CODE');
console.log('Final Price:', finalPrice);
