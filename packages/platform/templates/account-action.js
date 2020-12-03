import { MessagingDirector } from 'meteor/unchained:core-messaging';
import { Users } from 'meteor/unchained:core-users';

const {
  EMAIL_FROM,
  UI_ENDPOINT,
  EMAIL_WEBSITE_NAME = 'Unchained Webshop',
} = process.env;

const mjmlTemplate = `
<mjml>
  <mj-body background-color="#FAFAFA">
      <mj-section padding-bottom="32px" background-color="#fcfcfc">
        <mj-column width="100%">
          <mj-text align="center" font-size="20px" color="#232323" font-family="Helvetica Neue" font-weight="200">
            <h2>{{subject}}</h2>
          </mj-text>
          <mj-text align="left" font-size="20px" color="#232323" font-family="Helvetica Neue" font-weight="200">
            <span>{{message}}</span><br/>
          </mj-text>
        </mj-column>
      </mj-section>

      <mj-section padding-bottom="20px" background-color="#f3f3f3">
        <mj-column>
          <mj-button href="{{url}}" font-family="Helvetica" background-color="#31302E" color="white">
           {{buttonText}}
         </mj-button>
         <mj-spacer/>
        </mj-column>
      </mj-section>
  </mj-body>
</mjml>
`;

const verifyEmailEnglishConfig = {
  buttonText: 'Verify email address',
  message:
    'We need to ensure that this email is yours as a commercial partner.',
  subject: `${EMAIL_WEBSITE_NAME}: Verify your email address`,
};

const textTemplate = `
  {{message}}
  \n
  -----------------\n
  {{buttonText}}: {{url}}\n
  -----------------\n
`;

const emailConfig = {
  'enroll-account': {
    url: (token) => `${UI_ENDPOINT}/enroll-account?token=${token}`,
    en: {
      buttonText: 'Set password',
      message: `${EMAIL_WEBSITE_NAME} has set up an user account for you. Please click below to set up a password and to finish the registration.`,
      subject: `${EMAIL_WEBSITE_NAME}: You got a new account`,
    },
    de: {
      buttonText: 'Passwort setzen',
      message: `${EMAIL_WEBSITE_NAME} hat für dich ein Benutzerkonto angelegt. Bitte klicke unten um ein Passwort zu setzen und damit die Registrierung abzuschliessen.`,
      subject: `${EMAIL_WEBSITE_NAME}: Für dich wurde ein Konto eingerichtet`,
    },
    fr: {
      buttonText: 'Set password',
      message: `${EMAIL_WEBSITE_NAME} has set up an user account for you. Please click below to set up a password and to finish the registration.`,
      subject: `${EMAIL_WEBSITE_NAME}: You got a new account`,
    },
  },
  'reset-password': {
    url: (token) => `${UI_ENDPOINT}/reset-password?token=${token}`,
    en: {
      buttonText: 'Set new password',
      message: `
        Click on „Set new password". If you don’t want to set a new password, just ignore this email.\n
      `,
      subject: `${EMAIL_WEBSITE_NAME}: Set password`,
    },
    de: {
      buttonText: 'Neues Passwort setzen',
      message: `
        Klicke auf „Neues Passwort setzen", um ein neues Passwort anzulegen.\n
        Falls du dein Passwort nicht zurücksetzen möchtest, ignoriere dieses E-Mail einfach.\n
      `,
      subject: `${EMAIL_WEBSITE_NAME}: Passwort zurücksetzen`,
    },
    fr: {
      buttonText: 'Set new password',
      message: `
        Click on „Set new password". If you don’t want to set a new password, just ignore this email.\n
      `,
      subject: `${EMAIL_WEBSITE_NAME}: Set password`,
    },
  },
  'verify-email': {
    url: (token) => `${UI_ENDPOINT}/verify-email?token=${token}`,
    en: verifyEmailEnglishConfig,
    de: verifyEmailEnglishConfig,
    fr: verifyEmailEnglishConfig,
  },
};

export default ({ userId, action, recipientEmail, token }) => {
  if (!token || !action) return [];

  const user = Users.findOne({ _id: userId });
  const locale = user.locale();
  const { url } = emailConfig[action];
  const { subject, message, buttonText } = emailConfig[action][locale.language];

  const templateVariables = {
    subject,
    message,
    buttonText,
    url: url(token),
  };

  return [
    {
      type: 'EMAIL',
      input: {
        from: EMAIL_FROM,
        to: recipientEmail || user.primaryEmail()?.address,
        subject,
        text: MessagingDirector.renderToText(textTemplate, templateVariables),
        html: MessagingDirector.renderMjmlToHtml(
          mjmlTemplate,
          templateVariables
        ),
      },
    },
  ];
};
