import { log } from 'meteor/unchained:core-logger';
import { Countries } from 'meteor/unchained:core-countries';
import { Locales, Locale } from 'locale';
import { Languages } from 'meteor/unchained:core-languages';
import LRU from 'lru-cache';

const { LANG = 'de', COUNTRY = 'CH', NODE_ENV } = process.env;

const maxAge = NODE_ENV === 'production' ? 1000 * 60 : 1000 * 1; // minute or second

const localeContextCache = new LRU({
  max: 500,
  maxAge,
});

export const systemLocale = new Locale(`${LANG}-${COUNTRY}`);

let baseLanguage = systemLocale.language;
let baseCountry = systemLocale.country;

export const getFallbackLocale = () =>
  new Locale(`${baseLanguage}-${baseCountry}`);

export const resolveBestSupported = (acceptLanguage, supportedLocales) => {
  const acceptLocale = new Locales(acceptLanguage);
  const bestLocale = acceptLocale.best(supportedLocales);
  if (!bestLocale) return getFallbackLocale();
  return bestLocale;
};

export const resolveBestCountry = (localeCountry, shopCountry, countries) => {
  if (shopCountry) {
    const resolvedCountry = countries.reduce((lastResolved, country) => {
      if (shopCountry === country.isoCode) {
        return country.isoCode;
      }
      return lastResolved;
    }, null);
    if (resolvedCountry) {
      return resolvedCountry;
    }
  }
  return localeCountry || baseCountry;
};

export const buildLocaleContext = (req) => {
  const cacheKey = `${req.headers['accept-language']}:${req.headers['x-shop-country']}`;
  const cachedContext = localeContextCache.get(cacheKey);
  if (cachedContext) return cachedContext;

  // return the parsed locale by bcp47 and
  // return the best resolved normalized locale by locale according to system-wide configuration
  // else fallback to base language & base country
  const languages = Languages.find(
    { isActive: true },
    { fields: { isoCode: 1, isBase: 1, isActive: 1 } }
  ).fetch();
  const countries = Countries.find(
    { isActive: true },
    { fields: { isoCode: 1, isBase: 1, isActive: 1 } }
  ).fetch();

  const supportedLocaleStrings = languages.reduce((accumulator, language) => {
    if (language.isBase) baseLanguage = language.isoCode;
    const added = countries.map((country) => {
      if (country.isBase) baseCountry = country.isoCode;
      return `${language.isoCode}-${country.isoCode}`;
    });
    return accumulator.concat(added);
  }, []);

  const supportedLocales = new Locales(
    supportedLocaleStrings,
    getFallbackLocale().code
  );
  const localeContext = resolveBestSupported(
    req.headers['accept-language'],
    supportedLocales
  );
  const countryContext = resolveBestCountry(
    localeContext.country,
    req.headers['x-shop-country'],
    countries
  );
  log(
    `Locale Context: Resolved ${localeContext.normalized} ${countryContext}`,
    { level: 'debug' }
  );
  const newContext = {
    localeContext,
    countryContext,
  };
  localeContextCache.set(cacheKey, newContext);
  return newContext;
};
