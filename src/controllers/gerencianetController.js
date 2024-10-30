const GNRequest = require('../api/gerencianet.js');

const reqGNAlready = GNRequest();

const home = (req, res) => {
  return res.json("Hello")
}

const getQrCode = async (req, res) => {
  const reqGN = await reqGNAlready;
  const id = req.params.id;
    
  const qrcodeResponse = await reqGN.get(`/v2/loc/${id}/qrcode`);
  return res.json(qrcodeResponse.data)    
}

const createCob = async (req, res) => {
  const reqGN = await reqGNAlready;

  try {
    const dataCob = {
      calendario: {
        expiracao: 3600
      },
      valor: {
        "original": "2.00"
      },
      chave: "1b7884d6-ce50-4edc-b45e-11d39b61470b", // chave pix do cobrador
      solicitacaoPagador: "Cobrança dos serviços prestados."
    }
    //No response da cobrança imediata já gera um objeto com uma string do 'pixCopiaECola'
    const cobResponse = await reqGN.post('/v2/cob', dataCob);
    return res.json(cobResponse.data)
  } catch (error) {
    console.log(error);
    return res.json(error)
  }
}

module.exports = {
  home,
  getQrCode,
  createCob
}