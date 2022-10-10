const express = require('express');
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
const getGoogleAuthURL = ()=> {
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

//  1) Getting login url
app.get('/login',(req,res)=>{
  console.log('login page')
  res.send(getGoogleAuthURL())
})


//  2) Getting user from google with the code 
app.get('/homepage',(req,res)=>{
  console.log('home page')
  res.send(req.body)
})


const port = 1234
app.listen(port,()=>{
  console.log(`Listen on port ${port}`);
})