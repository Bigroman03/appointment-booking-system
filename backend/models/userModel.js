const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Veuillez fournir un nom'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Veuillez fournir un email'],
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Veuillez fournir un email valide',
      ],
    },
    password: {
      type: String,
      required: [true, 'Veuillez fournir un mot de passe'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Veuillez fournir un numéro de téléphone'],
    },
    role: {
      type: String,
      enum: ['client', 'professional', 'admin'],
      default: 'client',
    },
    // Champs supplémentaires pour les professionnels
    speciality: {
      type: String,
      required: function() {
        return this.role === 'professional';
      },
    },
    address: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
    description: {
      type: String,
      default: '',
    },
    services: [
      {
        name: String,
        description: String,
        duration: Number, // en minutes
        price: Number,
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Chiffrer le mot de passe avant de le sauvegarder
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Vérifier si le mot de passe correspond
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Générer un token JWT
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = mongoose.model('User', userSchema);
