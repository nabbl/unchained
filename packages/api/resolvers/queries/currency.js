import { log } from 'meteor/unchained:core-logger';
import { Currencies } from 'meteor/unchained:core-currencies';
import { InvalidIdError } from '../../errors';

export default function currency(root, { currencyId }, { userId }) {
  log(`query currency ${currencyId}`, { userId });

  if (!currencyId) throw new InvalidIdError({ currencyId });
  return Currencies.findCurrency({ currencyId });
}
