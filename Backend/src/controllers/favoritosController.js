const User = require ('../models/User');

// Agregar a favoritos
const agregarFavorito = async (req, res) => {
  const { videoId, title } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (user.favoritos.some(f => f.videoId === videoId)) {
      return res.status(400).json({ msg: 'El video ya está en favoritos' });
    }

    user.favoritos.push({ videoId, title });
    await user.save();

    res.json({ msg: 'Agregado a favoritos', favoritos: user.favoritos });
  } catch (err) {
    res.status(500).json({ msg: 'Error al agregar favorito' });
  }
};

// Obtener favoritos del usuario
const obtenerFavoritos = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.favoritos || []);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener favoritos' });
  }
};

// Eliminar de favoritos
const eliminarFavorito = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.favoritos = user.favoritos.filter(f => f.videoId !== req.params.videoId);
    await user.save();

    res.json({ msg: 'Eliminado de favoritos', favoritos: user.favoritos });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar favorito' });
  }
};

module.exports = {
  obtenerFavoritos,
  agregarFavorito,
  eliminarFavorito
};