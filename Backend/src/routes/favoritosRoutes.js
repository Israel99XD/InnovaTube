const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');
const {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito
} = require('../controllers/favoritosController');

router.get('/', verifyToken, obtenerFavoritos);
router.post('/', verifyToken, agregarFavorito);
router.delete('/:videoId', verifyToken, eliminarFavorito);

module.exports = router;
