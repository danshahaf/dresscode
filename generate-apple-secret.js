const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Your Apple Developer information
const teamId = 'ZHCSTGTA8K';  // Your Team ID
const clientId = 'com.example.dresscodeapp';  // Your Service ID
const keyId = 'VJL8USU499';  // Your Key ID
const privateKeyPath = path.join(__dirname, 'AuthKey_VJL8USU499.p8');  // Path to your private key file

// Read private key
const privateKey = fs.readFileSync(privateKeyPath);

// Create JWT
const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',  // Apple allows up to 6 months
  audience: 'https://appleid.apple.com',
  issuer: teamId,
  subject: clientId,
  keyid: keyId
});

console.log('Your Apple Client Secret (valid for 180 days):');
console.log(token);