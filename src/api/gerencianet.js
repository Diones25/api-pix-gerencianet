const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');

const cert = fs.readFileSync(
  path.resolve(__dirname, `../../certs/${process.env.GN_CERT}`)
);

const agent = new https.Agent({
  pfx: cert,
  passphrase: ''
});

const credentials = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENTE_SECRET}`).toString('base64');

// Função para obter o token de autenticação
const authenticate = () => {
  return axios({
    method: 'POST',
    url: `${process.env.GN_ENDPOINT}/oauth/token`,
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json'
    },
    httpsAgent: agent,
    data: {
      grant_type: "client_credentials"
    }
  });
}

const GNRequest = async () => {
  let authResponse = await authenticate();
  let accessToken = authResponse.data?.access_token;

  const instance = axios.create({
    baseURL: process.env.GN_ENDPOINT,
    httpsAgent: agent,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  // Interceptor de Requisição: verifica se o token está ausente
  instance.interceptors.request.use(async (config) => {
    if (!config.headers.Authorization) {
      const authResponse = await authenticate();
      const newAccessToken = authResponse.data?.access_token;
      config.headers.Authorization = `Bearer ${newAccessToken}`;
    }
    return config;
  });

  // Interceptor de Resposta: renova o token em caso de expiração (erro 401)
  instance.interceptors.response.use(
    (response) => response, // Passa a resposta normalmente se não houver erro
    async (error) => {
      const originalRequest = error.config;

      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Renova o token
        authResponse = await authenticate();
        accessToken = authResponse.data?.access_token;

        // Atualiza o cabeçalho de autorização com o novo token
        instance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        // Reenvia a requisição original com o novo token
        return instance(originalRequest);
      }

      return Promise.reject(error); // Retorna o erro se não for 401
    }
  );

  return instance;
}


module.exports = GNRequest;
