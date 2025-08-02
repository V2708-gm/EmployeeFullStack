const Employee = require('../models/Employee');
const createError = require('http-errors');

// Create employee
exports.createEmployee = async (req, res, next) => {
  try {
    const { name, email, department } = req.body;
    
    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      throw createError(400, 'Email already exists');
    }

    const employee = new Employee({ name, email, department });
    await employee.save();
    
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

// Get all employees
exports.getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// Get single employee
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      throw createError(404, 'Employee not found');
    }
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

// Update employee
exports.updateEmployee = async (req, res, next) => {
  try {
    const { name, email, department } = req.body;
    
    // Check if email is being changed to an existing one
    if (email) {
      const existingEmployee = await Employee.findOne({ 
        email, 
        _id: { $ne: req.params.id } 
      });
      if (existingEmployee) {
        throw createError(400, 'Email already exists');
      }
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, department },
      { new: true, runValidators: true }
    );
    
    if (!employee) {
      throw createError(404, 'Employee not found');
    }
    
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

// Delete employee
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      throw createError(404, 'Employee not found');
    }
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};