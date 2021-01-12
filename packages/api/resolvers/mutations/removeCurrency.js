import { log } from 'meteor/unchained:core-logger';
import { Currencies } from 'meteor/unchained:core-currencies';
import { CurrencyNotFoundError, InvalidIdError } from '../../errors';

export default function removeCurrency(root, { currencyId }, { userId }) {
  log(`mutation removeCurrency ${currencyId}`, { userId });
  if (!currencyId) throw new InvalidIdError({ currencyId });
  const currency = Currencies.findCurrency({ currencyId });
  if (!currency) throw new CurrencyNotFoundError({ currencyId });
  Currencies.removeCurrency({ currencyId });
  return currency;
}
