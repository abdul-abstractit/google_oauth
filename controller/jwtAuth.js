const jwt = require('jsonwebtoken');

const verifyToken = (token, secret) => {
  try {
    const decodedPayload = jwt.verify(token, secret);
    return { status:true, isExpired:false ,decodedPayload };
  } catch (error) {
    const isExpired = (error.name === 'TokenExpiredError')
    return (isExpired)?{ status:true, isExpired }:{status:false};
  }
}

const createAccessToken = (payload) => jwt.sign(
  { ...payload },
  process.env.JWT_ACCESS_TOKEN_SECRET,
  { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
);
const createRefreshToken = (payload) => jwt.sign(
  { ...payload },
  process.env.JWT_REFRESH_TOKEN_SECRET,
  { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
);

const jwtAuth = {
  getLoginTokens: (id) => {
    const accessToken = createAccessToken({ id });
    const refreshToken = createRefreshToken({ id });
    return { accessToken, refreshToken }
  },
  verifyAccessToken: (token) => verifyToken(token, process.env.JWT_ACCESS_TOKEN_SECRET),
  verifyRefreshToken: (token) => verifyToken(token, process.env.JWT_REFRESH_TOKEN_SECRET),
}

module.exports = jwtAuth;