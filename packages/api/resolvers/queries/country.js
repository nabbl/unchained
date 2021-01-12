import { log } from 'meteor/unchained:core-logger';
import { Countries } from 'meteor/unchained:core-countries';
import { CountryNotFoundError, InvalidIdError } from '../../errors';

export default function country(root, { countryId }, { userId }) {
  log(`query country ${countryId}`, { userId });

  if (!countryId) throw new InvalidIdError({ countryId });
  const foundCountry = Countries.findCountry({ countryId });
  if (!foundCountry) throw new CountryNotFoundError({ countryId });

  return foundCountry;
}
