import { Currencies } from './collections';

Currencies.createCurrency = ({ isoCode, ...countryData }) => {
  const _id = Currencies.insert({
    created: new Date(),
    isoCode: isoCode.toUpperCase(),
    isActive: true,
    ...countryData,
  });
  return Currencies.findOne({ _id });
};

Currencies.findCurrencies = ({ limit, offset, includeInactive }) => {
  const selector = {};
  if (!includeInactive) selector.isActive = true;
  return Currencies.find(selector, { skip: offset, limit }).fetch();
};

Currencies.currencyExists = ({ currencyId }) => {
  return !!Currencies.find({ _id: currencyId }, { limit: 1 }).count();
};

Currencies.findCurrency = ({ currencyId }) => {
  return Currencies.findOne({ _id: currencyId });
};

Currencies.removeCurrency = ({ currencyId }) => {
  return Currencies.remove({ _id: currencyId });
};

Currencies.updateCurrency = ({ currencyId, isoCode, ...currency }) => {
  return Currencies.update(
    { _id: currencyId },
    {
      $set: {
        isoCode: isoCode.toUpperCase(),
        ...currency,
        updated: new Date(),
      },
    }
  );
};
