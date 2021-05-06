import Token from '../utils/token';
const checkToken = async (req, res, next) => {
  const token =
    req.query.token || req.headers['x-access-token'] || req.body.token;
  console.log(
    req.query.token,
    ': ',
    req.headers['x-access-token'],
    ' : ',
    req.body.token
  );
  if (!token)
    return res.status(401).send({ message: 'User is not Authorized' });
  const verifiedToken = await Token.verifyToken(token);
  console.log(verifiedToken);
  if (!verifiedToken.success)
    return res.status(401).send({ message: 'User is not Authorized ' });
  req.decoded = verifiedToken;

  return next();
};

export default checkToken;
