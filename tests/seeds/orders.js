export const SimpleOrder = {
  _id: 'simple-order',
  created: new Date('2019-10-11T11:52:25.433+0000'),
  status: null,
  userId: 'user',
  currency: 'CHF',
  countryCode: 'CH',
  contact: {
    emailAddress: 'info@unchained.shop'
  },
  billingAddress: {
    addressLine: 'Bahnhofplatz 2',
    city: 'Zurich',
    postalCode: '8001'
  },
  calculation: [
    {
      category: 'ITEMS',
      amount: 20000
    },
    {
      category: 'PAYMENT',
      amount: 0
    },
    {
      category: 'DELIVERY',
      amount: 0
    },
    {
      category: 'DISCOUNTS',
      amount: 0
    }
  ],
  updated: new Date('2019-10-11T12:48:01.611+0000'),
  paymentId: 'simple-order-payment',
  deliveryId: 'simple-order-delivery'
};

export const SimplePayment = {
  _id: 'simple-order-payment',
  created: new Date('2019-10-11T11:52:25.446+0000'),
  status: null,
  orderId: 'simple-order',
  paymentProviderId: 'simple-payment-provider',
  context: {},
  updated: new Date('2019-10-11T12:48:01.537+0000'),
  calculation: []
};

export const SimpleDelivery = {
  _id: 'simple-order-delivery',
  created: new Date('2019-10-11T11:52:25.563+0000'),
  status: null,
  orderId: 'simple-order',
  deliveryProviderId: 'simple-delivery-provider',
  context: {},
  calculation: [],
  updated: new Date('2019-10-11T12:48:01.523+0000')
};

export const ConfirmedOrder = {
  _id: 'confirmed-order',
  created: new Date('2020-03-13T12:28:09.706+0000'),
  status: 'CONFIRMED',
  userId: 'user',
  currency: 'CHF',
  countryCode: 'CH',
  contact: {
    emailAddress: 'info@unchained.shop',
    telNumber: '+41999999999'
  },
  billingAddress: {
    firstName: 'Hallo',
    lastName: 'Velo',
    addressLine: 'Strasse 1',
    addressLine2: 'Postfach',
    postalCode: '8000',
    city: 'Zürich'
  },
  context: {
    hi: 'there'
  },
  calculation: [
    {
      category: 'ITEMS',
      amount: 20000
    },
    {
      category: 'PAYMENT',
      amount: 0
    },
    {
      category: 'DELIVERY',
      amount: 0
    },
    {
      category: 'DISCOUNTS',
      amount: 0
    }
  ],
  updated: new Date('2020-03-13T12:28:10.371+0000'),
  ordered: new Date('2020-03-13T12:28:10.371+0000'),
  confirmed: new Date('2020-03-13T12:28:10.371+0000'),
  log: [
    {
      date: new Date('2020-03-13T12:28:10.371+0000'),
      status: 'CONFIRMED',
      info: 'before delivery'
    }
  ],
  paymentId: 'confirmed-order-payment',
  deliveryId: 'confirmed-order-delivery'
};

export const ConfirmedOrderPayment = {
  _id: 'confirmed-order-payment',
  created: new Date('2020-03-13T12:28:09.706+0000'),
  status: null,
  orderId: 'confirmed-order',
  paymentProviderId: 'simple-payment-provider',
  context: {},
  updated: new Date('2020-03-13T12:28:10.371+0000'),
  calculation: []
};

export const ConfirmedOrderDelivery = {
  _id: 'confirmed-order-delivery',
  created: new Date('2020-03-13T12:28:09.706+0000'),
  status: null,
  orderId: 'confirmed-order',
  deliveryProviderId: 'simple-delivery-provider',
  context: {},
  calculation: [],
  updated: new Date('2020-03-13T12:28:10.371+0000')
};

export const DiscountedOrder = {
  _id: 'discounted-order',
  created: new Date('2019-10-11T11:52:25.433+0000'),
  status: null,
  userId: 'user',
  currency: 'CHF',
  countryCode: 'CH',
  calculation: [
    {
      category: 'ITEMS',
      amount: 100000
    },
    {
      category: 'TAXES',
      amount: 7149.489322191272
    },
    {
      category: 'PAYMENT',
      amount: 0
    },
    {
      category: 'DELIVERY',
      amount: 0
    },
    {
      category: 'DISCOUNTS',
      amount: -10000,
      discountId: 'discounted-order-discount'
    },
    {
      category: 'TAXES',
      amount: -714.9489322191266
    }
  ],
  updated: new Date('2019-10-11T12:48:01.611+0000'),
  paymentId: 'discounted-order-payment',
  deliveryId: 'discounted-order-delivery'
};

export const DiscountedPayment = {
  _id: 'discounted-order-payment',
  created: new Date('2019-10-11T11:52:25.446+0000'),
  status: null,
  orderId: 'discounted-order',
  paymentProviderId: 'simple-payment-provider',
  context: {},
  updated: new Date('2019-10-11T12:48:01.537+0000'),
  calculation: []
};

export const DiscountedDelivery = {
  _id: 'discounted-order-delivery',
  created: new Date('2019-10-11T11:52:25.563+0000'),
  status: null,
  orderId: 'discounted-order',
  deliveryProviderId: 'simple-delivery-provider',
  context: {},
  calculation: [],
  updated: new Date('2019-10-11T12:48:01.523+0000')
};

export const DiscountedDiscount = {
  _id: 'discounted-order-discount',
  code: '100OFF',
  trigger: 'USER',
  orderId: 'discounted-order',
  discountKey: 'shop.unchained.discount.100-off',
  created: new Date('2019-10-11T12:07:27.123+0000')
};

export const DiscountedProductDiscount = {
  _id: 'discounted-order-product-discount',
  code: 'HALFPRICE',
  trigger: 'USER',
  orderId: 'discounted-order',
  discountKey: 'shop.unchained.discount.half-price-manual',
  created: new Date('2019-10-11T12:48:01.435+0000')
};

export const SimplePosition = {
  _id: 'simple-order-position',
  orderId: 'simple-order',
  productId: 'simple-product',
  originalProductId: 'simple-product',
  quantity: 3,
  created: new Date('2019-10-11T12:15:42.456+0000'),
  calculation: [
    {
      category: 'ITEM',
      amount: 20000, // CHF 200
      isTaxable: true,
      isNetPrice: false,
      meta: {
        adapter: 'shop.unchained.pricing.product-price'
      }
    }
  ],
  scheduling: [],
  updated: new Date('2019-10-11T12:17:49.529+0000')
};

export const ConfirmedOrderPosition = {
  _id: 'confirmed-order-position',
  orderId: 'confirmed-order',
  productId: 'simple-product',
  originalProductId: 'simple-product',
  quantity: 3,
  created: new Date('2019-10-11T12:15:42.456+0000'),
  calculation: [
    {
      category: 'ITEM',
      amount: 20000, // CHF 200
      isTaxable: true,
      isNetPrice: false,
      meta: {
        adapter: 'shop.unchained.pricing.product-price'
      }
    }
  ],
  scheduling: [],
  updated: new Date('2019-10-11T12:17:49.529+0000')
};

export const DiscountedPosition = {
  _id: 'discounted-order-position',
  orderId: 'discounted-order',
  productId: 'simple-product',
  originalProductId: 'simple-product',
  quantity: 3,
  created: new Date('2019-10-11T12:15:42.456+0000'),
  calculation: [
    {
      category: 'ITEM',
      amount: 120000,
      isTaxable: true,
      isNetPrice: false,
      meta: {
        adapter: 'shop.unchained.pricing.product-price'
      }
    },
    {
      category: 'DISCOUNT',
      amount: -60000,
      isTaxable: true,
      discountId: 'discounted-order-product-discount',
      meta: {
        adapter: 'shop.unchained.pricing.product-discount'
      }
    },
    {
      category: 'ITEM',
      amount: -8579.387186629523,
      isTaxable: false,
      isNetPrice: false,
      meta: {
        adapter: 'shop.unchained.pricing.product-swiss-tax'
      }
    },
    {
      category: 'TAX',
      amount: 8579.387186629523,
      rate: 0.077,
      meta: {
        adapter: 'shop.unchained.pricing.product-swiss-tax'
      }
    },
    {
      category: 'DISCOUNT',
      amount: 4289.6935933147615,
      isTaxable: false,
      discountId: 'discounted-order-product-discount',
      meta: {
        adapter: 'shop.unchained.pricing.product-swiss-tax'
      }
    },
    {
      category: 'TAX',
      amount: -4289.6935933147615,
      rate: 0.077,
      meta: {
        adapter: 'shop.unchained.pricing.product-swiss-tax'
      }
    }
  ],
  scheduling: [],
  updated: new Date('2019-10-11T12:17:49.529+0000')
};

export default async function seedOrders(db) {
  await db.collection('orders').findOrInsertOne(DiscountedOrder);
  await db.collection('order_payments').findOrInsertOne(DiscountedPayment);
  await db.collection('order_deliveries').findOrInsertOne(DiscountedDelivery);
  await db.collection('order_discounts').findOrInsertOne(DiscountedDiscount);
  await db
    .collection('order_discounts')
    .findOrInsertOne(DiscountedProductDiscount);
  await db.collection('order_positions').findOrInsertOne(DiscountedPosition);

  await db.collection('orders').findOrInsertOne(SimpleOrder);
  await db.collection('order_payments').findOrInsertOne(SimplePayment);
  await db.collection('order_deliveries').findOrInsertOne(SimpleDelivery);
  await db.collection('order_positions').findOrInsertOne(SimplePosition);

  await db.collection('orders').findOrInsertOne(ConfirmedOrder);
  await db.collection('order_payments').findOrInsertOne(ConfirmedOrderPayment);
  await db
    .collection('order_deliveries')
    .findOrInsertOne(ConfirmedOrderDelivery);
  await db
    .collection('order_positions')
    .findOrInsertOne(ConfirmedOrderPosition);
}
