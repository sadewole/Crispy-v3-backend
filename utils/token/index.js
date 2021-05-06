const jwt = require('jsonwebtoken');

require('dotenv').config();

/**
 * scrambles string data
 * @param {String} token - input string data
 * @returns {String} - scrambled data
 */
const shuffleToken = (token) => token.split('').reverse().join('');

/**
 * Class representing the Authentication methods
 * @class Authentication
 * @description Authentication class methods
 */
module.exports = {
  /**
   * creates a user token
   * @param {object} payload - contains id, role username and hashedPassword
   * @param {integer} expiresIn - Time in seconds
   * @returns {string} - returns a jwt token
   */
  getToken(payload, expiresIn = '24h') {
    const token = jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn,
      }
    );
    const scrambledToken = shuffleToken(token);
    return scrambledToken;
  },

  /**
   * verify a token's validity
   * @param {string} token - token input
   * @returns {req} - populate the request with the decrypted content
   */
  async verifyToken(token) {
    const reshuffledToken = await shuffleToken(token);
    let output = {};
    return jwt.verify(
      reshuffledToken,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          console.log(err);
          output = {
            Error: 'Failed to authenticate token',
            success: false,
          };
        } else {
          output = {
            success: true,
            id: decoded.id,
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            role: decoded.role,
          };
        }
        return output;
      }
    );
  },
};
