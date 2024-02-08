if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const router = require('./routes/router.js');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use(router);

app.listen(8000, () => {
  console.log('running => http://localhost:8000');
})

/* 
body request de cobrança
{
  "calendario": {
    "expiracao": 3600
  },
  "devedor": {
    "cpf": "12345678909",
    "nome": "Francisco da Silva"
  },
  "valor": {
    "original": "100.00"
  },
  "chave": "1b7884d6-ce50-4edc-b45e-11d39b61470b",
  "solicitacaoPagador": "Cobrança dos serviços prestados."
}
*/