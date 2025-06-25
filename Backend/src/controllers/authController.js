const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const axios = require('axios');

// Registro
const register = async (req, res) => {
  const {
    sNombre,
    sApellidoPaterno,
    sApellidoMaterno,
    sCorreo,
    sUsername,
    sPasword,
    recaptchaToken
  } = req.body;

  if (!recaptchaToken) {
    return res.status(400).json({ msg: 'Token de reCAPTCHA es requerido' });
  }

  try {
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secret,
        response: recaptchaToken
      }
    });

    if (!response.data.success) {
      return res.status(400).json({ msg: 'reCAPTCHA inválido, por favor intenta de nuevo.' });
    }

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

// Login
const login = async (req, res) => {
  const { sIdentificador, sPasword } = req.body;

  try {
    const usuario = await User.findOne({
      $or: [
        { sCorreo: sIdentificador },
        { sUsername: sIdentificador }
      ]
    });
    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(sPasword, usuario.sPasword);
    if (!passwordValido) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario._id, username: usuario.sUsername },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token, usuario: {
        id: usuario._id,
        sNombre: usuario.sNombre,
        sApellidoPaterno: usuario.sApellidoPaterno,
        sCorreo: usuario.sCorreo,
        sUsername: usuario.sUsername
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const forgotPassword = async (req, res) => {
  const { sCorreo } = req.body;

  try {
    const usuario = await User.findOne({ sCorreo });

    if (!usuario) {
      return res.status(400).json({ msg: 'El correo no está registrado' });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString(); // Ej: 6 dígitos
    const expiracion = Date.now() + 10 * 60 * 1000; // 10 minutos

    usuario.resetCode = codigo;
    usuario.resetCodeExpires = expiracion;
    await usuario.save();

    // Envía correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: sCorreo,
      subject: 'Código de recuperación',
      text: `Tu código de recuperación es: ${codigo}\n\nEste código expira en 10 minutos.`
    };

    await transporter.sendMail(mailOptions);

    res.json({ msg: 'Código enviado al correo registrado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const verifyResetCode = async (req, res) => {
  const { sCorreo, codigo } = req.body;

  try {
    const usuario = await User.findOne({ sCorreo });

    if (!usuario || usuario.resetCode !== codigo || usuario.resetCodeExpires < Date.now()) {
      return res.status(400).json({ msg: 'Código inválido o expirado' });
    }

    res.json({ msg: 'Código válido' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

const resetPasswordWithCode = async (req, res) => {
  const { sCorreo, codigo, nuevaPassword } = req.body;

  try {
    const usuario = await User.findOne({ sCorreo });

    if (!usuario || usuario.resetCode !== codigo || usuario.resetCodeExpires < Date.now()) {
      return res.status(400).json({ msg: 'Código inválido o expirado' });
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    usuario.sPasword = hashedPassword;
    usuario.resetCode = undefined;
    usuario.resetCodeExpires = undefined;

    await usuario.save();

    res.json({ msg: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};


const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { nuevaPassword } = req.body;

  try {
    const usuario = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!usuario) {
      return res.status(400).json({ msg: 'Token inválido o expirado' });
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    usuario.sPasword = hashedPassword;
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;

    await usuario.save();

    res.json({ msg: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
};


module.exports =
{
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyResetCode,
  resetPasswordWithCode
};