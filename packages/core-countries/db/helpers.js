import 'meteor/dburles:collection-helpers';
import countryFlags from 'emoji-flags';
import countryI18n from 'i18n-iso-countries';
import { Currencies } from 'meteor/unchained:core-currencies';
import LRU from 'lru-cache';
import { Countries } from './collections';

const { NODE_ENV } = process.env;

const maxAge = NODE_ENV === 'production' ? 1000 * 60 : -1; // minute or second

const currencyCodeCache = new LRU({
  max: 500,
  maxAge,
});

const { CURRENCY } = process.env;

Countries.helpers({
  makeBase() {
    Countries.update(
      { isBase: true },
      {
        $set: {
          isBase: false,
          updated: new Date(),
        },
      },
      { multi: true }
    );
    Countries.update(this._id, {
      $set: {
        isBase: true,
        updated: new Date(),
      },
    });

    return Countries.findOne(this._id);
  },
  updateCountry({ country }) {
    Countries.update(this._id, {
      $set: {
        ...country,
        updated: new Date(),
      },
    });
    return Countries.findOne(this._id);
  },
  defaultCurrency() {
    if (this.defaultCurrencyId) {
      return Currencies.findOne({ _id: this.defaultCurrencyId });
    }
    return null;
  },
  name(language) {
    return countryI18n.getName(this.isoCode, language) || language;
  },
  flagEmoji() {
    return countryFlags.countryCode(this.isoCode).emoji || '❌';
  },
});

Countries.createCountry = ({ isoCode, ...countryData }) => {
  const _id = Countries.insert({
    created: new Date(),
    isoCode: isoCode.toUpperCase(),
    isActive: true,
    ...countryData,
  });
  return Countries.findOne({ _id });
};

Countries.resolveDefaultCurrencyCode = ({ isoCode }) => {
  const currencyCode = currencyCodeCache.get(isoCode);
  if (currencyCode) return currencyCode;

  const country = Countries.findOne({ isoCode });
  const currency = country && country.defaultCurrency();
  const liveCurrencyCode = (currency && currency.isoCode) || CURRENCY || 'CHF';
  currencyCodeCache.set(isoCode, liveCurrencyCode);
  return liveCurrencyCode;
};
