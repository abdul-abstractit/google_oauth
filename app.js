require('dotenv').config({ path: './config.env' });
const express = require('express');
const googleAuth = require('./controller/googleAuth');

const app = express();

app.use(express.json());

app.get('/login', (req, res) => {
  res.redirect(googleAuth.getGoogleAuthURL());
})

app.get('/homepage', async (req, res) => {
  const user = await googleAuth.getGoogleUser(req.query);
  res.send(`User Data: ${JSON.stringify(user,null,2)}`);
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
})