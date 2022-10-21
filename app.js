require('dotenv').config({ path: './config.env' });
const express = require('express');
const cookieParser = require('cookie-parser');
const authentication = require('./controller/authentication');

const app = express();

app.use(cookieParser());
app.use(express.json());

app.get('/login', authentication.login);
app.get('/google-auth', authentication.verifyGoogleLogin);
app.post('/renewAccessToken', authentication.renewAccessToken);

app.get('/protected', authentication.protect, (req, res) => {
  res.send("Protected route");
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
})