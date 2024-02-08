const { Router } = require('express');
const gerecianetController = require('../controllers/gerencianetController.js');

const router = Router();

router.get('/', gerecianetController.getQrCode)

module.exports = router;