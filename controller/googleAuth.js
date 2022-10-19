const axios = require('axios')
const { google } = require('googleapis')

const url = `${process.env.URL}:${process.env.PORT}`
const oauthRedirectUri = `${url}${process.env.OAUTH_RETURN_URL}`
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  oauthRedirectUri
);

const googleAuth = {
  getGoogleAuthURL: () => {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes,
    });
  },

  getGoogleUser: async ({ code }) => {
    const { tokens: {access_token, id_token} } = await oauth2Client.getToken(code);
    const authUser = await axios(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      },
    )
  
    return authUser.data;
  }
}


module.exports = googleAuth;