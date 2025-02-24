import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner, Alert } from "react-bootstrap";

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://127.0.0.1:8000/api/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data.");
      }

      const data = await response.json();
      setUser(data);
    } catch (error) {
      setError("Error loading profile data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="shadow-lg p-4 w-50">
        <Card.Body>
          <h3 className="text-center mb-4">Profile Details</h3>

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Row>
              <Col md={6}>
                <p>
                  <strong>Name:</strong> {user.username}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong>{" "}
                  <span
                    className={`badge ${
                      user.role === "admin"
                        ? "bg-danger"
                        : user.role === "manager"
                        ? "bg-warning"
                        : "bg-success"
                    }`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Company:</strong>{" "}
                  {user.company ? user.company.name : "Not Assigned"}
                </p>
                {user.role === "employee" && (
                  <>
                    <p>
                      <strong>Department:</strong> {user.department || "N/A"}
                    </p>
                    <p>
                      <strong>Designation:</strong> {user.designation || "N/A"}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`badge ${
                          user.status === "pending"
                            ? "bg-warning"
                            : user.status === "hired"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {user.status}
                      </span>
                    </p>
                  </>
                )}
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
