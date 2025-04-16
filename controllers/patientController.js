const db = require('../models/db');

exports.addPatient = (req, res) => {
  const {
    firstName,
    lastName,
    dateOfBirth,
    email,
    phone,
    gender,
    diagnosis,
    bloodType,
    allergies
  } = req.body;

  if (
    !firstName || !lastName || !dateOfBirth || !email || !phone ||
    !gender || !diagnosis || !bloodType
  ) {
    return res.status(400).json({
      message: 'Validation failed. Please fill in all required fields.',
    });
  }

  const query = `
    INSERT INTO patients 
    (firstName, lastName, dateOfBirth, email, phone, gender, diagnosis, bloodType, allergies)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(
    query,
    [firstName, lastName, dateOfBirth, email, phone, gender, diagnosis, bloodType, allergies],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);  
        if (err.code === 'ER_DUP_ENTRY') {
          let field = '';
          if (err.message.includes('email')) field = 'email';
          if (err.message.includes('phone')) field = 'phone';
          
          return res.status(409).json({
            message: `Patient with this ${field} already exists.`,
            error: err.message
          });
        }
        return res.status(500).json({
          message: 'Failed to add patient due to a database error.',
          error: err.message
        });
      }

      res.status(201).json({
        message: 'Patient added successfully.',
        patientId: results.insertId
      });
    }
  );
};

exports.getAllPatients = (req, res) => {
  let baseQuery = 'SELECT * FROM patients';
  const sort = req.query.sort;
  const filters = [];

  const allowedFilters = ['firstName', 'lastName', 'email','id'];
  allowedFilters.forEach((field) => {
    if (req.query[field]) {
      filters.push(`${field} LIKE ${db.escape('%' + req.query[field] + '%')}`);
    }
  });

  if (filters.length > 0) {
    baseQuery += ' WHERE ' + filters.join(' AND ');
  }

baseQuery += ' LIMIT 20';
  const allowedSortFields = ['firstName', 'lastName', 'email', 'gender', 'dateOfBirth'];
  if (sort && allowedSortFields.includes(sort)) {
    baseQuery += ` ORDER BY ${sort}`;
  }

  db.query(baseQuery, (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message});
    }
    res.status(200).json(results);
  });
};

exports.getPatientById = (req, res) => {
  const patientId = req.params.id;

  const query = 'SELECT * FROM patients WHERE id = ?';

  db.query(query, [patientId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Patient not found',error: err.message });
    }

    res.status(200).json(results[0]);
  });
};