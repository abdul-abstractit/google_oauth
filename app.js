require('dotenv').config({ path: './config.env' });
const express = require('express');
const { getGoogleAuthURL, getGoogleUser } = require('./controller/googleAuth')

const app = express();
app.use(express.json());

app.get('/login', (req, res) => {
  res.send(getGoogleAuthURL());
})

app.get('/homepage', async (req, res) => {
  const user = await getGoogleUser(req.query);
  res.send(user);
})

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Listen on port ${port}`);
})