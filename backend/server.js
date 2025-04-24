const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Chargement des variables d'environnement
dotenv.config();

// Connexion à la base de données MongoDB
connectDB();

// Initialisation de l'app Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes de base
app.get('/', (req, res) => {
  res.send('API du système de prise de rendez-vous est en ligne');
});

// Routes à venir
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/appointments', require('./routes/appointmentRoutes'));
// app.use('/api/availability', require('./routes/availabilityRoutes'));

// Port et démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
