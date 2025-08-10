const express = require('express');
const {
  getAllEmployees, createEmployee, getEmployee,
  updateEmployee, deleteEmployee
} = require('../controllers/employeeController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.use(auth); // protect all employee routes

router.get('/', getAllEmployees);
router.post('/', createEmployee);
router.get('/:id', getEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

module.exports = router;
