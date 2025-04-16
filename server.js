const express = require('express');
const cors = require('cors');
const patientRoutes = require('./routes/patientRoutes');
const connection = require('./models/db'); 
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', patientRoutes);


const createTableSQL = `
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  dateOfBirth DATE NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL UNIQUE,
  gender ENUM('Male', 'Female') NOT NULL,
  diagnosis TEXT NOT NULL,
  bloodType ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  allergies TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

connection.query(createTableSQL, (err) => {
  if (err) {
    console.error('Failed to create table:', err);
    process.exit(1);
  }
  console.log('Table "patients" checked/created successfully.');

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
