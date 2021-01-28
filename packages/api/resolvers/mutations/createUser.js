import { log } from 'meteor/unchained:core-logger';
import { Users } from 'meteor/unchained:core-users';
import hashPassword from '../../hashPassword';

export default async function createUser(root, options, context) {
  log('mutation createUser', { email: options.email });
  if (!options.password && !options.plainPassword) {
    throw new Error('Password is required');
  }
  const mappedOptions = options;
  if (!mappedOptions.password) {
    mappedOptions.password = hashPassword(mappedOptions.plainPassword);
    delete mappedOptions.plainPassword;
  }

  const createdUser = await Users.createUser(mappedOptions, context);
  return Users.createLoginToken(createdUser, context);
}
