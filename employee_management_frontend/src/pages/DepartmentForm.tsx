import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

const DepartmentForm: React.FC = () => {
  const { id } = useParams(); // ✅ لاستخدامه عند التعديل
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
    if (id) fetchDepartment();
  }, [id]);

  // ✅ جلب بيانات الشركات لربط القسم بإحداها
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://127.0.0.1:8000/api/companies/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch companies");

      const data = await response.json();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ جلب بيانات القسم في حالة التعديل
  const fetchDepartment = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://127.0.0.1:8000/api/departments/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch department details");

      const data = await response.json();
      setName(data.name);
      setCompany(data.company.toString());
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ حفظ القسم (إضافة أو تعديل)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://127.0.0.1:8000/api/departments/${id}/`
      : "http://127.0.0.1:8000/api/departments/";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, company }),
      });

      if (!response.ok) throw new Error("Failed to save department");

      navigate("/departments");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card className="shadow-lg p-4">
        <Card.Body>
          <h3 className="text-center mb-4">{id ? "Edit Department" : "Add Department"}</h3>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Department Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Form.Select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              >
                <option value="">Select a Company</option>
                {companies.map((comp: any) => (
                  <option key={comp.id} value={comp.id}>
                    {comp.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? "Saving..." : id ? "Update Department" : "Add Department"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DepartmentForm;
