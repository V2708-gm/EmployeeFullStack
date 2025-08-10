import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function EmployeeList({ employees, onEdit, onDelete }) {
  return (
    <div className="employee-app">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => onEdit(emp)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="btn btn-delete" onClick={() => onDelete(emp._id)}>
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-state">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
