const axios = require('axios')
const { google } = require('googleapis')

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.OAUTH_RETURN_URL
);

exports.getGoogleAuthURL = ()=> {
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
}
  
exports.getGoogleUser = async ({ code }) => {
  const { tokens } = await oauth2Client.getToken(code);
  const res = await axios(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
    {
      headers: {
        Authorization: `Bearer ${tokens.id_token}`,
      },
    },
  )
  
  return res.data;
}
