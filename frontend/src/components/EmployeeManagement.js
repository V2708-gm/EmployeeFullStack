import React, { useState, useEffect } from "react";
import { Container, Button, Badge } from "react-bootstrap";
import { FaSignOutAlt, FaUserPlus, FaSync, FaMemory, FaDatabase, FaList, FaChartBar } from "react-icons/fa";
import { toast } from 'react-toastify';
import api, { getEmployees } from "../api";
import EmployeeList from "./EmployeeList";
import EmployeeFormModal from "./EmployeeFormModal";
import AnalyticsPage from "./AnalyticsPage";
import "../App.css";

export default function EmployeeManagement({ setIsLoggedIn }) {
  const [employees, setEmployees] = useState([]);
  const [fromCache, setFromCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const fetchEmployees = async () => {
    setIsRefreshing(true);
    try {
      const { employees, fromCache } = await getEmployees();
      setEmployees(employees || []);
      setFromCache(fromCache);
      setLastUpdated(new Date());
    } catch (err) {
      toast.error(err.message || "Failed to fetch employees");
      setEmployees([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (activeSection === "list") {
      fetchEmployees();
    }
  }, [activeSection]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    setIsLoggedIn(false);
  };

  const handleEdit = (employee) => {
    setCurrentEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`/employees/${id}`);
        //toast.success("Employee deleted successfully");
        fetchEmployees();
      } catch (err) {
        toast.error(err.response?.data?.error?.message || "Delete failed");
      }
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (currentEmployee) {
        await api.put(`/employees/${currentEmployee._id}`, employeeData);
        //toast.success("Employee updated successfully");
      } else {
        await api.post("/employees", employeeData);
        //toast.success("Employee created successfully");
      }
      setShowModal(false);
      setCurrentEmployee(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Operation failed");
    }
  };

  // Create animated text spans
  const renderAnimatedText = (text) => {
    return text.split("").map((char, index) => (
      <span 
        key={index} 
        style={{ 
          animationDelay: `${index * 0.1}s`,
          display: char === ' ' ? 'inline' : 'inline-block'
        }}
      >
        {char}
      </span>
    ));
  };

  return (
    <Container className="employee-management-container">
      <h1 className="app-main-title">Employee Management System</h1>

      {/* Animated section selector */}
      {activeSection === "" && (
        <div className="section-selector">
          <div className="animated-text-container">
            {renderAnimatedText("Select a section to view")}
          </div>
          <div className="animated-arrow">↓</div>
        </div>
      )}

      {/* Main action buttons */}
      <div className="action-buttons-container">
        <Button
          variant={activeSection === "list" ? "primary" : "outline-primary"}
          onClick={() => setActiveSection("list")}
          className="action-btn employee-list-btn"
        >
          <FaList className="btn-icon" />
          <span>Employee List</span>
        </Button>

        <Button
          variant={activeSection === "analytics" ? "primary" : "outline-primary"}
          onClick={() => setActiveSection("analytics")}
          className="action-btn analytics-btn"
        >
          <FaChartBar className="btn-icon" />
          <span>Analytics</span>
        </Button>

        <Button
          variant="danger"
          onClick={handleLogout}
          className="action-btn logout-btn"
        >
          <FaSignOutAlt className="btn-icon" />
          <span>Logout</span>
        </Button>
      </div>

      {/* Employee List Section */}
      {activeSection === "list" && (
        <>
          <div className="section-header">
            <h2 className="section-title">
              <FaList className="section-icon" />
              Employee List
            </h2>
            <div className="section-actions">
              <Button
                variant="info"
                onClick={fetchEmployees}
                className="refresh-btn"
                disabled={isRefreshing}
              >
                <FaSync className={isRefreshing ? "spin" : ""} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                variant="success"
                onClick={() => setShowModal(true)}
                className="add-btn"
              >
                <FaUserPlus /> Add Employee
              </Button>
            </div>
          </div>

          <div className="data-status">
            <Badge bg={fromCache ? "success" : "primary"} className="data-badge">
              {fromCache ? <FaMemory /> : <FaDatabase />}
              {fromCache ? " Cached Data" : " Fresh Data"}
            </Badge>
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>

          <EmployeeList
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <EmployeeFormModal
            show={showModal}
            onHide={() => {
              setShowModal(false);
              setCurrentEmployee(null);
            }}
            onSubmit={handleSaveEmployee}
            employee={currentEmployee}
          />
        </>
      )}

      {/* Analytics Section */}
      {activeSection === "analytics" && <AnalyticsPage />}
    </Container>
  );
}