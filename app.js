require('dotenv').config({ path: './config.env' });
const express = require('express');
const googleAuth = require('./controller/googleAuth');

const app = express();
const google = googleAuth();

app.use(express.json());

app.get('/login', (req, res) => {
  res.redirect(google.getGoogleAuthURL());
})

app.get('/homepage', async (req, res) => {
  const user = await google.getGoogleUser(req.query);
  res.send(`User Data: ${JSON.stringify(user,null,2)}`);
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
})