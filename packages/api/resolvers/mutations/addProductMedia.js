import { log } from 'meteor/unchained:core-logger';
import { Products } from 'meteor/unchained:core-products';
import { ProductNotFoundError, InvalidIdError } from '../../errors';

export default async function addProductMedia(
  root,
  { media, productId, href, name, meta, tags },
  { userId }
) {
  log(`mutation addProductMedia ${productId}`, { userId });
  if (!productId) throw new InvalidIdError({ productId });
  const product = Products.findProduct({ productId });
  if (!product) throw new ProductNotFoundError({ productId });
  const res = await product.addMedia({
    rawFile: media,
    authorId: userId,
    href,
    meta,
    tags,
  });
  return res;
}
