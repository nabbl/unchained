import { log } from 'meteor/unchained:core-logger';
import { Users } from 'meteor/unchained:core-users';
import { UserNotFoundError, InvalidIdError } from '../../errors';

export default async function setUsername(
  root,
  { username, userId: foreignUserId },
  { userId }
) {
  log(`mutation setUsername ${foreignUserId}`, { userId });
  if (!foreignUserId) throw new InvalidIdError({ foreignUserId });
  const user = Users.findOne({ _id: foreignUserId });
  if (!user) throw new UserNotFoundError({ userId: foreignUserId });
  const res = await user.setUsername(username);
  return res;
}
