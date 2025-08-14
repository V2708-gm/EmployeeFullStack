module.exports.getAnalytics = async (req, res, next) => {
  try {
    const data = {
      totalCalls: await req.redis.get("analytics:total_calls") || 0,
      employeesCreated: await req.redis.get("analytics:employee_created") || 0,
      employeesUpdated: await req.redis.get("analytics:employee_updated") || 0,
      employeesDeleted: await req.redis.get("analytics:employee_deleted") || 0,
      employeeListViews: await req.redis.get("analytics:employee_list_views") || 0
    };

    res.json(data);
  } catch (err) {
    next(err);
  }
};
