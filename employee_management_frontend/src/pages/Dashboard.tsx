import React, { useEffect, useState } from "react";
import { Container, Table, Navbar, Row, Col, Card, Alert } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://127.0.0.1:8000/api/employees/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      console.log("Employees Data:", data); 
      setEmployees(data);
    } catch (error) {
      setError("Error fetching employees.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="content flex-grow-1 p-4">
        <Navbar bg="light" className="shadow-sm p-3">
          <Container>
            <Navbar.Brand className="fw-bold">Employee Management</Navbar.Brand>
          </Container>
        </Navbar>

        <Container className="mt-4">
          <Row className="justify-content-center">
            <Col md={10}>
              <Card className="shadow-lg p-4">
                <Card.Body>
                  <h3 className="mb-4 text-center">Employees List</h3>

                  {error && <Alert variant="danger">{error}</Alert>}

                  {loading ? (
                    <p className="text-center text-muted">Loading employees...</p>
                  ) : employees.length > 0 ? (
                    <Table striped bordered hover responsive>
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile</th>
                          <th>Designation</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((emp: any) => (
                          <tr key={emp.id}>
                            <td>{emp.id}</td>
                            <td>{emp.user?.username || "N/A"}</td>
                            <td>{emp.user?.email || "N/A"}</td>
                            <td>{emp.user?.mobile || "N/A"}</td>
                            <td>{emp.designation || "N/A"}</td>
                            <td>
                              <span
                                className={`badge ${
                                  emp.status === "pending"
                                    ? "bg-warning"
                                    : emp.status === "hired"
                                    ? "bg-success"
                                    : "bg-danger"
                                }`}
                              >
                                {emp.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted">No employees found.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
