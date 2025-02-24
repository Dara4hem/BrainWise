import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";

const Login: React.FC = () => {
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginField,
          password: password,
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Invalid credentials");
      }
  
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
  
      const userResponse = await fetch("http://127.0.0.1:8000/api/user/", {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });
  
      const userData = await userResponse.json();
      localStorage.setItem("userRole", userData.role);
  
      if (userData.role === "admin") {
        navigate("/dashboard");
      } else if (userData.role === "manager") {
        navigate("/dashboard");
      } else {
        navigate("/profile"); // ✅ الموظف يتم تحويله لصفحة بياناته فقط
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  return (
    <div className="d-flex vh-100">
      {/* ✅ Sidebar مثل الـ Dashboard */}
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          width: "30%",
          background: "linear-gradient(to bottom, #212529, #343A40)",
          color: "white",
          padding: "20px",
        }}
      >
        <h1 className="fw-bold">Welcome Back</h1>
        <p>Login to continue managing employees</p>
      </div>

      {/* ✅ Login Form */}
      <Container className="d-flex justify-content-center align-items-center flex-grow-1">
        <Card style={{ width: "400px" }} className="shadow-lg p-4">
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Username or Email</Form.Label>
                <Form.Control
                  type="text"
                  value={loginField}
                  onChange={(e) => setLoginField(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
