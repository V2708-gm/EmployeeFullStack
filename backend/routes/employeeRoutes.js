const express = require('express');
const router = express.Router();
const {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');

// CRUD routes
router.post('/', createEmployee);
router.get('/', getAllEmployees);
router.get('/:id', getEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;