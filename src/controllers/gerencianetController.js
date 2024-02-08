const GNRequest = require('../api/gerencianet.js');

const reqGNAlready = GNRequest();

const getQrCode = async (req, res) => {
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
    
}

module.exports = {
  getQrCode
}