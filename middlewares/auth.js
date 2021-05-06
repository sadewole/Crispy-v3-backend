const Token = require('../utils/token');

exports.checkToken = async (req, res, next) => {
  const token =
    req.query.token || req.headers['x-access-token'] || req.body.token;

  if (!token)
    return res.status(401).send({ message: 'User is not Authorized' });
  const verifiedToken = await Token.verifyToken(token);
  console.log(verifiedToken);
  if (!verifiedToken.success)
    return res.status(401).send({ message: 'User is not Authorized ' });
  req.decoded = verifiedToken;

  return next();
};

exports.onlyAdmin = async (req, res, next) => {
  const { role } = req.decoded;
  if (role !== 'ADMIN') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized user. This route is for admin alone',
    });
  }
  return next();
};
