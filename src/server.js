const axios = require("axios");
const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const cert = fs.readFileSync(
  path.resolve(__dirname, `../cert/certificado_homolocacao.pem`)
);

console.log(cert);

const agent = new https.Agent({
  pfx: cert,
  passphrase: ''
});



