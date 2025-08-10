const Employee = require('../models/Employee');
const createError = require('http-errors');

// Create employee
exports.createEmployee = async (req, res, next) => {
  try {
    const { name, email, department } = req.body;

    // Check for duplicate email
    const existing = await Employee.findOne({ email });
    if (existing) {
      throw createError(400, 'Email already exists');
    }

    const emp = new Employee({ name, email, department });
    await emp.save();

    // Invalidate cache
    await req.redis.del('employeeList');

    // Analytics and Pub/Sub
    await req.redis.incr('analytics:employee_created');
    await req.redis.publish('new-employee', JSON.stringify(emp));

    res.status(201).json(emp);
  } catch (err) {
    next(err);
  }
};

// Get all employees (with Redis cache)
exports.getAllEmployees = async (req, res, next) => {
  try {
    const key = 'employeeList';
    const cached = await req.redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const employees = await Employee.find().sort({ createdAt: -1 });

    await req.redis.set(key, JSON.stringify(employees), 'EX', 60); // cache for 60 seconds
    await req.redis.incr('analytics:employee_list_views');

    res.json(employees);
  } catch (err) {
    next(err);
  }
};

// Get single employee
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      throw createError(404, 'Employee not found');
    }

    await req.redis.incr(`analytics:employee_view:${req.params.id}`);

    res.json(employee);
  } catch (err) {
    next(err);
  }
};

// Update employee
exports.updateEmployee = async (req, res, next) => {
  try {
    const { name, email, department } = req.body;

    // Check for duplicate email (exclude current)
    if (email) {
      const existing = await Employee.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      if (existing) {
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

    // Invalidate cache and update analytics
    await req.redis.del('employeeList');
    await req.redis.incr('analytics:employee_updated');

    res.json(employee);
  } catch (err) {
    next(err);
  }
};

// Delete employee
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      throw createError(404, 'Employee not found');
    }

    // Invalidate cache and update analytics
    await req.redis.del('employeeList');
    await req.redis.incr('analytics:employee_deleted');

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    next(err);
  }
};
