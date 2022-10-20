const jwt = require('jsonwebtoken');

const getExpiredPayload = (token, secret) => {
  const decodedPayload = jwt.verify(token, secret, { ignoreExpiration: true });
  return { status: true, isExpired: true, payload: decodedPayload };
}
const verifyToken = (token, secret) => {
  try {
    const decodedPayload = jwt.verify(token, secret);
    return { status: true, isExpired: false, payload: decodedPayload };
  } 
  catch (error) {
    const isExpired = (error.name === 'TokenExpiredError')
    return (isExpired) ? getExpiredPayload(token,secret): { status: false };
  }
}

const jwtAuth = {
  createAccessToken: (payload) => jwt.sign(
    { ...payload },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN }
  ),
  createRefreshToken: (payload) => jwt.sign(
    { ...payload },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN }
  ),
  getLoginTokens: (id) => {
    const accessToken = jwtAuth.createAccessToken({ id });
    const refreshToken = jwtAuth.createRefreshToken({ id });
    return { accessToken, refreshToken }
  },
  verifyAccessToken: (token) => verifyToken(token, process.env.JWT_ACCESS_TOKEN_SECRET),
  verifyRefreshToken: (token) => verifyToken(token, process.env.JWT_REFRESH_TOKEN_SECRET),
}

module.exports = jwtAuth;