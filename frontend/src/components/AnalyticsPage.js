import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { FaChartPie, FaChartBar, FaDatabase } from "react-icons/fa";

const COLORS = ["#4e73df", "#1cc88a", "#36b9cc", "#f6c23e", "#e74a3b"];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics");
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="analytics-loading">
        <Spinner animation="border" variant="primary" />
        <p>Loading analytics dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container fluid className="analytics-container">
        <Alert variant="danger" className="analytics-alert">
          <FaDatabase className="me-2" />
          Error: {error}
        </Alert>
      </Container>
    );
  }

  const pieData = [
    { name: "Created", value: Number(data.employeesCreated) },
    { name: "Updated", value: Number(data.employeesUpdated) },
    { name: "Deleted", value: Number(data.employeesDeleted) },
    { name: "List Views", value: Number(data.employeeListViews) }
  ];

  const barData = [
    { name: "Created", count: Number(data.employeesCreated) },
    { name: "Updated", count: Number(data.employeesUpdated) },
    { name: "Deleted", count: Number(data.employeesDeleted) },
    { name: "List Views", count: Number(data.employeeListViews) }
  ];

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h1 className="analytics-title">
          <FaChartBar className="me-2" />
          Employee Analytics Dashboard
        </h1>
      </div>

      <div className="analytics-content">
        <Row className="g-4 mb-4">
          <Col xl={3} lg={6}>
            <Card className="analytics-card total-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-label">TOTAL API CALLS</h6>
                    <h2 className="card-value">{data.totalCalls}</h2>
                  </div>
                  <div className="card-icon">
                    <FaDatabase />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6}>
            <Card className="analytics-card created-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-label">EMPLOYEES CREATED</h6>
                    <h2 className="card-value">{data.employeesCreated}</h2>
                  </div>
                  <div className="card-icon">
                    <FaChartBar />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6}>
            <Card className="analytics-card updated-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-label">EMPLOYEES UPDATED</h6>
                    <h2 className="card-value">{data.employeesUpdated}</h2>
                  </div>
                  <div className="card-icon">
                    <FaChartBar />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={6}>
            <Card className="analytics-card deleted-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-label">EMPLOYEES DELETED</h6>
                    <h2 className="card-value">{data.employeesDeleted}</h2>
                  </div>
                  <div className="card-icon">
                    <FaChartBar />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={6}>
            <Card className="analytics-chart-card">
              <Card.Body>
                <div className="chart-header">
                  <h5>
                    <FaChartPie className="me-2" />
                    Activity Distribution
                  </h5>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={5}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        value, 
                        `${name}: ${(props.payload.percent * 100).toFixed(1)}%`
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="analytics-chart-card">
              <Card.Body>
                <div className="chart-header">
                  <h5>
                    <FaChartBar className="me-2" />
                    Activity Comparison
                  </h5>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      name="Activity Count"
                      radius={[4, 4, 0, 0]}
                    >
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}