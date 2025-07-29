const helmet = require('helmet');
const mongosanitize = require('express-mongo-sanitize');

const securityMiddleware = [helmet(), mongosanitize()];

module.exports = securityMiddleware;
