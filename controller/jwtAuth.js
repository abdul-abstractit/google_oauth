const jwt = require('jsonwebtoken');

const isJWTExpired = (token, secret) => { };


const createAccessToken = (id) => jwt.sign(
  { id },
  process.env.JWT_ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
)
const verifyAccessToken = (token) => { };
const createRefreshToken = (id) => jwt.sign(
  { id },
  process.env.JWT_REFRESH_TOKEN_SECRET,
  { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
)
const verifyRefreshToken = (token) => { };

const jwtAuth = {
  getLoginTokens: (id) => {
    const accessToken = createAccessToken(id);
    const refreshToken = createRefreshToken(id);
    return {accessToken,refreshToken}
  },
  deleteLoginCredentials: () => {

  },
}

module.exports = jwtAuth;