import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import AnimatedWrapper from "../components/AnimatedWrapper";
import { useNotification } from "../context/NotificationContext";

const Login: React.FC = () => {
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // لإظهار سبينر أثناء تسجيل الدخول
  const navigate = useNavigate();
  const { addNotification } = useNotification(); // لإظهار إشعارات

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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

      // تخزين التوكن
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // جلب بيانات المستخدم لتحديد الـ role
      const userResponse = await fetch("http://127.0.0.1:8000/api/user/", {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      const userData = await userResponse.json();
      localStorage.setItem("userRole", userData.role);

      // إشعار بالنجاح
      addNotification("Logged in successfully!", "success");

      // توجيه حسب الدور
      if (userData.role === "admin" || userData.role === "manager") {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err: any) {
      setError(err.message);
      addNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedWrapper>
      <div className="d-flex vh-100">
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

        <Container className="d-flex justify-content-center align-items-center flex-grow-1">
          <Card style={{ width: "400px" }} className="shadow-lg p-4">
            <Card.Body>
              <h2 className="text-center mb-4">Login</h2>

              {/* عرض رسالة الخطأ إن وجدت */}
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

                {/* زر تسجيل الدخول أو سبينر أثناء التحميل */}
                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </AnimatedWrapper>
  );
};

export default Login;
