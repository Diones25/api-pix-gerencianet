const { Router } = require('express');
const gerecianetController = require('../controllers/gerencianetController.js');

const router = Router();

router.get('/', gerecianetController.home)
router.get('/v2/loc/:id/qrcode', gerecianetController.getQrCode)
router.get('/v2/cob', gerecianetController.createCob)

module.exports = router;