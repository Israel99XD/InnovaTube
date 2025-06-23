const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro
const register = async (req, res) => {
  const {
    sNombre,
    sApellidoPaterno,
    sApellidoMaterno,
    sCorreo,
    sUsername,
    sPasword
  } = req.body;

  try {
    const existeCorreo = await User.findOne({ sCorreo });
    const existeUsername = await User.findOne({ sUsername });

    if (existeCorreo || existeUsername) {
      return res.status(400).json({ msg: 'Correo o usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(sPasword, 10);

    const nuevoUsuario = new User({
      sNombre,
      sApellidoPaterno,
      sApellidoMaterno,
      sCorreo,
      sUsername,
      sPasword: hashedPassword
    });

    await nuevoUsuario.save();

    res.status(201).json({ msg: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

module.exports = { register};