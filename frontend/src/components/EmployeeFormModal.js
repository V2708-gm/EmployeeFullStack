import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';

const employeeSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  department: Yup.string().required('Department is required'),
});

export default function EmployeeFormModal({ show, onHide, onSubmit, employee }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {employee ? 'Edit Employee' : 'Add Employee'}
          </h2>
        </div>
        
        <Formik
          initialValues={{
            name: employee?.name || '',
            email: employee?.email || '',
            department: employee?.department || '',
          }}
          validationSchema={employeeSchema}
          onSubmit={(values, actions) => {
            onSubmit(values);
            actions.setSubmitting(false);
          }}
          enableReinitialize
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />
                  {touched.name && errors.name && (
                    <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                      {errors.name}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                  />
                  {touched.email && errors.email && (
                    <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    name="department"
                    className="form-input"
                    value={values.department}
                    onChange={handleChange}
                    placeholder="Enter department"
                  />
                  {touched.department && errors.department && (
                    <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                      {errors.department}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-close"
                  onClick={onHide}
                >
                  Close
                </button>
                <button 
                  type="submit" 
                  className="btn btn-save"
                >
                  {employee ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}