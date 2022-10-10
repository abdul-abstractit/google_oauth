const express = require('express');
const axios = require('axios')
const { google } = require('googleapis')

const app = express();
app.use(express.json());

const GOOGLE_CLIENT_ID = "196695137780-2mtblgc3ber32ic0frpaetkiak6coult.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:1234/homepage'
);
const getGoogleAuthURL = (oauth2Client)=> {
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
const getGoogleUser = async ({ code }) => {
  const { tokens } = await oauth2Client.getToken(code);
  console.log(tokens)
  console.log(`Access Token: ${tokens.access_token}`)
  console.log(`Bearer Token: ${tokens.id_token}`)

  const res = await axios(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
    {
      headers: {
        Authorization: `Bearer ${tokens.id_token}`,
      },
    },
  )
  
  const googleUser = res.data


  return googleUser;
}

//  1) Getting login url
app.get('/login',(req,res)=>{
  res.send(getGoogleAuthURL(oauth2Client))
})


//  2) Getting user from google with the code 
app.get('/homepage', async (req,res)=>{
  const user=await getGoogleUser(req.query)
  res.send(user)
})


const port = 1234
app.listen(port,()=>{
  console.log(`Listen on port ${port}`);
})
// 