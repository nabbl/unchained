import PricingSheet from '../pricing-sheet';

const OrderPricingSheetRowCategories = {
  Items: 'ITEMS',
  Discounts: 'DISCOUNTS',
  Taxes: 'TAXES',
  Delivery: 'DELIVERY',
  Payment: 'PAYMENT',
};

class OrderPricingSheet extends PricingSheet {
  addItems({ amount, meta }) {
    this.calculation.push({
      category: OrderPricingSheetRowCategories.Items,
      amount,
      meta,
    });
  }

  addDiscounts({ amount, discountId, meta }) {
    this.calculation.push({
      category: OrderPricingSheetRowCategories.Discounts,
      amount,
      discountId,
      meta,
    });
  }

  addTaxes({ amount, meta }) {
    this.calculation.push({
      category: OrderPricingSheetRowCategories.Taxes,
      amount,
      meta,
    });
  }

  addDelivery({ amount, meta }) {
    this.calculation.push({
      category: OrderPricingSheetRowCategories.Delivery,
      amount,
      meta,
    });
  }

  addPayment({ amount, meta }) {
    this.calculation.push({
      category: OrderPricingSheetRowCategories.Payment,
      amount,
      meta,
    });
  }

  gross() {
    // tax is included 2 times, this is only true for Order Pricing!
    return this.sum() - this.taxSum();
  }

  taxSum() {
    return this.sum({
      category: OrderPricingSheetRowCategories.Taxes,
    });
  }

  itemsSum() {
    return this.sum({
      category: OrderPricingSheetRowCategories.Items,
    });
  }

  discountSum(discountId) {
    return this.sum({
      category: OrderPricingSheetRowCategories.Discounts,
      discountId,
    });
  }

  discountPrices(explicitDiscountId) {
    const discountIds = this.getDiscountRows(explicitDiscountId).map(
      ({ discountId }) => discountId
    );

    return [...new Set(discountIds)]
      .map((discountId) => {
        const amount = this.sum({
          category: OrderPricingSheetRowCategories.Discount,
          discountId,
        });
        if (!amount) {
          return null;
        }
        return {
          discountId,
          amount,
          currency: this.currency,
        };
      })
      .filter(Boolean);
  }

  getDiscountRows(discountId) {
    return this.filterBy({
      category: OrderPricingSheetRowCategories.Discounts,
      discountId,
    });
  }

  getItemsRows() {
    return this.filterBy({ category: OrderPricingSheetRowCategories.Items });
  }

  getTaxesRows() {
    return this.filterByCategory({
      category: OrderPricingSheetRowCategories.Taxes,
    });
  }

  getDeliveryRows() {
    return this.filterByCategory({
      category: OrderPricingSheetRowCategories.Delivery,
    });
  }

  getPaymentRows() {
    return this.filterByCategory({
      category: OrderPricingSheetRowCategories.Payment,
    });
  }
}

export { OrderPricingSheet, OrderPricingSheetRowCategories };
