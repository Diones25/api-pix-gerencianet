const GNRequest = require('../api/gerencianet.js');

const reqGNAlready = GNRequest();

const getQrCode = async (req, res) => {
  const reqGN = await reqGNAlready;
  const id = req.params.id;
    
  const qrcodeResponse = await reqGN.get(`/v2/loc/${id}/qrcode`);
  return res.json(qrcodeResponse.data)    
}

const createCob = async (req, res) => {
  const reqGN = await reqGNAlready;

  const dataCob = {
    calendario: {
      expiracao: 3600
    },
    valor: {
      "original": "2.00"
    },
    chave: "", // chave pix do cobrador
    solicitacaoPagador: "Cobrança dos serviços prestados." 
  } 
  //No response da cobrança imediata já gera um objeto com uma string do 'pixCopiaECola'
  const cobResponse = await reqGN.post('/v2/cob', dataCob);
  return res.json(cobResponse.data)
}

module.exports = {
  getQrCode,
  createCob
}