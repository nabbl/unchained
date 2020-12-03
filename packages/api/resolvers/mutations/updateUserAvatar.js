import { Promise } from 'meteor/promise';
import { log } from 'meteor/unchained:core-logger';
import { Avatars, Users } from 'meteor/unchained:core-users';

export default function updateUserAvatar(
  root,
  { avatar, userId: foreignUserId },
  { userId }
) {
  const normalizedUserId = foreignUserId || userId;
  log(`mutation updateUserAvatar ${normalizedUserId}`, { userId });
  let avatarRef;
  if (avatar.buffer) {
    avatarRef = Promise.await(
      Avatars.insertWithRemoteBuffer({
        file: {
          ...avatar,
          buffer: Buffer.from(avatar.buffer, 'base64'),
        },
        userId: normalizedUserId,
      })
    );
  } else {
    avatarRef = Promise.await(
      Avatars.insertWithRemoteFile({
        file: avatar,
        userId: normalizedUserId,
      })
    );
  }

  Users.update(
    { _id: normalizedUserId },
    {
      $set: {
        updated: new Date(),
        avatarId: avatarRef._id,
      },
    }
  );
  return Users.findOne({ _id: normalizedUserId });
}
