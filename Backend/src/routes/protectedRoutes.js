const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');

router.get('/perfil', verifyToken, (req, res) => {
  res.json({
    msg: 'Token válido, acceso concedido',
    user: req.user // Contiene los datos decodificados del JWT
  });
});

module.exports = router;
