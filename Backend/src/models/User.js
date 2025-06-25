const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    sNombre: { type: String, required: true },
    sApellidoPaterno: { type: String, required: true },
    sApellidoMaterno: { type: String, required: true },
    sCorreo: { type: String, required: true, unique: true },
    sUsername: { type: String, required: true, unique: true },
    sPasword: { type: String, required: true },
    resetCode: String,
    resetCodeExpires: Date,
    favoritos: [
      {
        videoId: String,
        title: String,
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);