import { log } from 'meteor/unchained:core-logger';
import { OrderDeliveries } from 'meteor/unchained:core-orders';
import { DeliveryProviderType } from 'meteor/unchained:core-delivery';
import {
  OrderDeliveryNotFoundError,
  InvalidIdError,
  OrderDeliveryTypeError,
} from '../../errors';

export default function updateOrderDeliveryShipping(
  root,
  { orderDeliveryId, ...context },
  { userId }
) {
  log(`mutation updateOrderDeliveryShipping ${orderDeliveryId}`, { userId });

  if (!orderDeliveryId) throw new InvalidIdError({ orderDeliveryId });
  const orderDelivery = OrderDeliveries.findOne({ _id: orderDeliveryId });
  if (!orderDelivery) throw new OrderDeliveryNotFoundError({ orderDeliveryId });
  const deliveryProviderType = orderDelivery?.provider()?.type;
  if (deliveryProviderType !== DeliveryProviderType.SHIPPING)
    throw new OrderDeliveryTypeError({
      orderDeliveryId,
      received: deliveryProviderType,
      required: DeliveryProviderType.SHIPPING,
    });

  return orderDelivery.updateContext(context);
}
