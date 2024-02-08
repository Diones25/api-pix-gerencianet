if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const GNRequest = require('./api/gerencianet.js');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'src/views');

const reqGNAlready = GNRequest();

app.get('/', async (req, res) => {
  const reqGN = await reqGNAlready;

  const dataCob = {
    calendario: {
      expiracao: 3600
    },
    valor: {
      "original": "2.00"
    },
    chave: "1b7884d6-ce50-4edc-b45e-11d39b61470b",
    solicitacaoPagador: "Cobrança dos serviços prestados."
  }

  //No response da cobrança imediata já gera um objeto com uma string do 'pixCopiaECola'
  const cobResponse = await reqGN.post('/v2/cob', dataCob);
  const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`);
  res.render('qrcode', { qrcodeImage: qrcodeResponse.data.imagemQrcode })
  

});

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