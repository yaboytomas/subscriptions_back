const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  console.log('Generating token for user:', user._id);
  console.log(
    'JWT_SECRET being used for generation:',
    process.env.JWT_SECRET ? 'EXISTS' : 'MISSING'
  );
  console.log('JWT_SECRET value:', process.env.JWT_SECRET);

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  console.log('Generated token:', token);
  return token;
};

module.exports = generateToken;
