import React, { useEffect, useState } from "react";
import { Form, Button, Container, Navbar, Modal } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const CompanyForm: React.FC = () => {
  const [name, setName] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCompany = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          const response = await fetch(`http://127.0.0.1:8000/api/companies/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch company data");
          }

          const data = await response.json();
          setName(data.name);
        } catch (error) {
          console.error("Error fetching company:", error);
        }
      };

      fetchCompany();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://127.0.0.1:8000/api/companies/${id}/`
      : "http://127.0.0.1:8000/api/companies/";

    try {
      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      setShowSuccessModal(true); // ✅ إظهار النافذة عند النجاح
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate("/companies"); // ✅ الانتقال إلى قائمة الشركات بعد النجاح
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>{id ? "Edit Company" : "Add Company"}</Navbar.Brand>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit">
            {id ? "Update Company" : "Add Company"}
          </Button>
        </Form>
      </Container>

      {/* ✅ Modal تأكيد الحفظ الناجح */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {id ? "Company updated successfully!" : "Company added successfully!"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CompanyForm;
