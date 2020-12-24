import sinon from 'sinon';
import 'sinon-mongo';

const Users = sinon.mongo.collection({
  update: sinon
    .stub()
    .withArgs(
      { _id: 'user' },
      { $addToSet: { roles: { $each: ['test_role'] } } },
    )
    .returns({ ok: 1, nModified: 1, n: 1 }),
});

Users.findOne
  .withArgs({ _id: 'admin' }, { fields: { roles: 1 } })
  .returns({ _id: 'admin', roles: ['test_role', 'admin'] });

Users.findOne
  .withArgs({ _id: 'user' }, { fields: { roles: 1 } })
  .returns({ _id: 'user', roles: ['test_role'] });

Users.findOne
  .withArgs({ _id: 'permission_user' }, { fields: { roles: 1 } })
  .returns({ _id: 'permission_user', roles: ['permission_test_role'] });

module.exports.Users = Users;
