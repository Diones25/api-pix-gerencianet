if(process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const express = require('express');
const apiRequest = require('./api/gerencianet.js');

const app = express();

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'src/views');
const apiReady = apiRequest({
  clientID: process.env.GN_CLIENT_ID,
  clientSecret: process.env.GN_CLIENTE_SECRET
});

app.get('/', async (req, res) => { //Essa get gera um QRcode de cobrança   
  const api = await apiReady;

  //const api = await apiRequest(); essa linha gera o token repetidas vezes

  const dataCob = {
    calendario: {
      expiracao: 3600,
    },
    valor: {
      original: "08.75",
    },
    chave: "71cdf9ba-c695-4e3c-b010-abb521a3f1be",
    solicitacaoPagador: "Informe o número ou identificador do pedido.",
  };

  const cobResponse = await api.post('v2/cob', dataCob)
    
  
  const qrcodeResponse = await api.get(`v2/loc/${cobResponse.data.loc.id}/qrcode`);
  
  //res.send(qrcodeResponse.data);

  res.render('qrcode', {qrcodeImage: qrcodeResponse.data.imagemQrcode})
})

app.get('/cobrancas', async(req, res) => { //lista as cobranças
  const api = await apiReady;

  const cobResponse = await api.get('/v2/cob?inicio=2023-05-11T16:01:35Z&fim=2023-05-13T20:10:00Z');

  res.send(cobResponse.data)
});

app.post('/webhook(/pix)?', (req, res) => {
  console.log(req.body);
  res.send('200');
})

app.listen(8000, () => {
  console.log('running => http://localhost:8000')
})

 