require('dotenv').config({ path: './config.env' });
const express = require('express');
const cookieParser = require('cookie-parser');
const googleAuth = require('./controller/googleAuth');
const jwtAuth = require('./controller/jwtAuth')

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get('/login', (req, res) => {
  res.redirect(googleAuth.getGoogleAuthURL());
})

app.get(`/google-auth`, async (req, res) => {
  const user = await googleAuth.getGoogleUser(req.query);
  const {accessToken, refreshToken} = jwtAuth.getLoginTokens(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie('accessToken', accessToken, cookieOptions)
  res.cookie('refreshToken', refreshToken, cookieOptions)
  res.status(200).send({accessToken, refreshToken});
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
})