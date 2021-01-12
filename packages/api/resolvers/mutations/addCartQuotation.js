import { log } from 'meteor/unchained:core-logger';
import { Quotations, QuotationStatus } from 'meteor/unchained:core-quotations';
import {
  QuotationNotFoundError,
  QuotationWrongStatusError,
  OrderQuantityTooLowError,
  InvalidIdError,
} from '../../errors';
import getCart from '../../getCart';

export default async function addCartQuotation(
  root,
  { orderId, quotationId, quantity, configuration },
  { user, userId, countryContext }
) {
  log(
    `mutation addCartQuotation ${quotationId} ${quantity} ${
      configuration ? JSON.stringify(configuration) : ''
    }`,
    { userId, orderId }
  );
  if (!quotationId) throw new InvalidIdError({ quotationId });
  if (quantity < 1) throw new OrderQuantityTooLowError({ quantity });
  const quotation = Quotations.findQuotation({ quotationId });
  if (!quotation) throw new QuotationNotFoundError({ quotationId });
  if (quotation.status !== QuotationStatus.PROPOSED) {
    throw new QuotationWrongStatusError({ status: quotation.status });
  }
  const cart = await getCart({ orderId, user, countryContext });
  return cart.addQuotationItem({
    quotation,
    quantity,
    configuration,
  });
}
