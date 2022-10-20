require('dotenv').config({ path: './config.env' });
const express = require('express');
const cookieParser = require('cookie-parser');
const googleAuth = require('./controller/googleAuth');
const jwtAuth = require('./controller/jwtAuth')

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get('/login', (req, res) => res.redirect(googleAuth.getGoogleAuthURL()));

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};
app.get(`/google-auth`, async (req, res) => {
  const user = await googleAuth.getGoogleUser(req.query);
  const { accessToken, refreshToken } = jwtAuth.getLoginTokens(user.id);
  res.cookie('accessToken', accessToken, cookieOptions)
  res.cookie('refreshToken', refreshToken, cookieOptions)
  res.status(200).send({ accessToken, refreshToken });
})

const respondInvalidToken = (res) => res.status(403).send({ message: "Invalid Token" });
const respondTokenExpired = (res) => res.status(200).send({ message: "Token expired" })
const respondNewAccessToken = (res, payload) => {
  const newAccessToken = jwtAuth.createAccessToken(payload)
  res.cookie('accessToken', newAccessToken, cookieOptions);
  res.status(200).send({ newAccessToken })
}

const verifyLogin = (req, res, next) => {
  const checkForExpiration = ({ isExpired }) => 
    (isExpired) ? respondTokenExpired(res) : next();
  const accessToken = req.headers.authorization.split(' ')[1];
  const result = jwtAuth.verifyAccessToken(accessToken);
  (result.status) ? checkForExpiration(result) : respondInvalidToken(res);
}

app.post("/renewAccessToken", (req, res) => {
  const reLogin = (res) => {
    res.redirect('/login')
  }
  const checkForExpiration = ({ isExpired, payload: { id } }) =>
    (isExpired) ? reLogin(res) : respondNewAccessToken(res,{ id });
  const { refreshToken } = req.body;
  const result = jwtAuth.verifyRefreshToken(refreshToken);
  (result.status) ? checkForExpiration(result) : respondInvalidToken(res);
})

app.get('/protected', verifyLogin, (req, res) => {
  res.send("Protected route");
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
})