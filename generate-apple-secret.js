

// Run: npm install jsonwebtoken
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Replace these values with your own details
const TEAM_ID = 'ZHCSTGTA8K';           // e.g., 1ABCD234E5
const KEY_ID = '7HHBPL4B3C';             // e.g., V8LABS49U9
const SERVICE_ID = 'com.seagulltechnologies.dresscode.signin'; // Your Services ID
const PRIVATE_KEY_PATH = './AuthKey_7HHBPL4B3C.p8';        // Path to your downloaded .p8 file

const privateKey = fs.readFileSync(PRIVATE_KEY_PATH);

const token = jwt.sign(
  {
    iss: TEAM_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 15777000, // Approximately 6 months
    aud: 'https://appleid.apple.com',
    sub: SERVICE_ID,
  },
  privateKey,
  {
    algorithm: 'ES256',
    header: {
      kid: KEY_ID,
    },
  }
);

console.log('Your new Apple JWT:', token);
