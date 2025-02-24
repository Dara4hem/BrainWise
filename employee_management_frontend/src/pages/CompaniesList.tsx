import React, { useEffect, useState } from "react";
import { Button, Container, Table, Modal, Form, Spinner, Alert } from "react-bootstrap";

const CompaniesList: React.FC = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
  const [deleteCompanyId, setDeleteCompanyId] = useState<number | null>(null);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ✅ جلب بيانات الشركات
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://127.0.0.1:8000/api/companies/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }

      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      setError("Error fetching companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ إضافة أو تحديث شركة
  const handleAddOrUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!["admin", "manager"].includes(userRole || "")) {
      setError("You do not have permission to perform this action.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const method = editCompanyId ? "PUT" : "POST";
    const url = editCompanyId
      ? `http://127.0.0.1:8000/api/companies/${editCompanyId}/`
      : "http://127.0.0.1:8000/api/companies/";

    try {
      await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: companyName }),
      });

      setShowModal(false);
      setCompanyName("");
      setEditCompanyId(null);
      fetchCompanies();
      setShowSuccessModal(true);
    } catch (error) {
      setError("Error saving company. Please try again.");
    }
  };

  // ✅ تأكيد الحذف
  const handleConfirmDelete = async () => {
    if (deleteCompanyId !== null) {
      if (!["admin", "manager"].includes(userRole || "")) {
        setError("You do not have permission to delete companies.");
        return;
      }

      const token = localStorage.getItem("accessToken");
      try {
        await fetch(`http://127.0.0.1:8000/api/companies/${deleteCompanyId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setShowDeleteModal(false);
        fetchCompanies();
        setShowSuccessModal(true);
      } catch (error) {
        setError("Error deleting company. Please try again.");
      }
    }
  };

  return (
    <Container>
      <h2 className="mb-4 text-center">Companies List</h2>

      {/* ✅ عرض خطأ عند الفشل */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* ✅ زر إضافة شركة */}
      {["admin", "manager"].includes(userRole || "") && (
        <Button className="mb-3" onClick={() => setShowModal(true)}>
          + Add Company
        </Button>
      )}

      {/* ✅ عرض الـ Loader أثناء تحميل البيانات */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              {["admin", "manager"].includes(userRole || "") && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map((company: any) => (
                <tr key={company.id}>
                  <td>{company.id}</td>
                  <td>{company.name}</td>
                  {["admin", "manager"].includes(userRole || "") && (
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => {
                          setCompanyName(company.name);
                          setEditCompanyId(company.id);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </Button>{" "}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setDeleteCompanyId(company.id);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">
                  No companies found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* ✅ Modal لإضافة أو تعديل شركة */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editCompanyId ? "Edit Company" : "Add Company"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddOrUpdateCompany}>
            <Form.Group className="mb-3">
              <Form.Label>Company Name</Form.Label>
              <Form.Control
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editCompanyId ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ✅ Modal تأكيد الحذف */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this company?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Modal نجاح العملية */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Action completed successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CompaniesList;
