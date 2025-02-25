import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  Navbar,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AnimatedWrapper from "../components/AnimatedWrapper";
import DashboardAnalytics from "../components/DashboardAnalytics";
import SearchBar from "../components/SearchBar";
import { useNotification } from "../context/NotificationContext";

const Dashboard: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
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
      setEmployees(data);
      setFilteredEmployees(data); 
    } catch (err: any) {
      setError(err.message || "Error fetching employees.");
      addNotification(err.message || "Error fetching employees.", "error");
    } finally {
      setLoading(false);
    }
  };

  // دالة البحث
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredEmployees(employees);
      return;
    }
    const filtered = employees.filter((emp) =>
      emp.user?.username?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmployees(filtered);
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

        <AnimatedWrapper>
          <Container className="mt-4">
            <DashboardAnalytics />

            {error && <Alert variant="danger">{error}</Alert>}

            <SearchBar
              placeholder="Search employees by name..."
              onSearch={handleSearch}
            />

            <Row className="justify-content-center">
              <Col md={10}>
                <Card className="shadow-lg p-4">
                  <Card.Body>
                    <h3 className="mb-4 text-center">Employees List</h3>

                    {loading ? (
                      <div className="text-center">
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </Spinner>
                      </div>
                    ) : filteredEmployees.length > 0 ? (
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
                          {filteredEmployees.map((emp: any) => (
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
                      <p className="text-center text-muted">
                        No employees found.
                      </p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </AnimatedWrapper>
      </div>
    </div>
  );
};

export default Dashboard;
