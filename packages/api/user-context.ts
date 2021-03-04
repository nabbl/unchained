import { accountsServer } from 'meteor/unchained:core-accountsjs';
import { Users } from 'meteor/unchained:core-users';
import { check } from 'meteor/check';
import { User } from './interfaces/user';

export interface UnchainedServerUserContext {
  userId?: string;
  user?: any;
  loginToken?: string;
}

const getFetch = async (url, { headers, method = 'GET' }) => {
  return fetch(url, {
    method,
    headers,
  });
};

export default async (req): Promise<UnchainedServerUserContext> => {
  // there is a possible current user connected!
  let loginToken = req.headers['meteor-login-token'];
  if (req.cookies.meteor_login_token) {
    loginToken = req.cookies.meteor_login_token;
  }
  if (req.cookies.token) {
    loginToken = req.cookies.token;
  }
  if (req.headers.authorization) {
    const [type, token] = req.headers.authorization.split(' ');
    if (type === 'Bearer') {
      loginToken = token;
    }
  }
  if (loginToken) {
    // throw an error if the token is not a string
    check(loginToken, String);

    // the hashed token is the key to find the possible current user in the db
    const hashedToken = accountsServer.hashLoginToken(loginToken); // eslint-disable-line

    const currentUser = Users.findUser({
      hashedToken,
    });

    // the current user exists
    if (currentUser) {
      // find the right login token corresponding, the current user may have
      // several sessions logged on different browsers / computers
      const tokenInformation = currentUser.services.resume.loginTokens.find(
        (tokenInfo) => tokenInfo.hashedToken === hashedToken
      ); // eslint-disable-line

      // get an exploitable token expiration date
      const expiresAt = accountsServer.tokenExpiration(tokenInformation.when); // eslint-disable-line

      // true if the token is expired
      const isExpired = expiresAt < new Date();

      // if the token is still valid, give access to the current user
      // information in the resolvers context
      if (!isExpired) {
        // return a new context object with the current user & her id
        return {
          user: currentUser,
          userId: currentUser._id,
          loginToken,
        };
      }
    } else {
        const response = await getFetch(`https://uptown-development.panter.biz/api/v1/current_user`, { headers: { authorization: req.headers.authorization }});
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
  
        if (isJson && response.status === 200 && response.ok) {
          const user = await response.json() as User ;
          let dbUser = Users.findOne( {username: user.email });
          if (!dbUser) {
              const id = Users.insert(
              {
                username: user.email,
                roles: ['admin'],
                emails: [ { address: user.email, verified: true } ],
                profile: { address: { street: user.full_address }, displayName: user.full_name },
                guest: false,
                created: new Date()
              },
            );
            dbUser = Users.findUser({userId:id});
          }
          return {
            user: dbUser,
            userId: dbUser._id,
            loginToken,
          };
        }
    }
    return { loginToken };
  }

  return {};
};
