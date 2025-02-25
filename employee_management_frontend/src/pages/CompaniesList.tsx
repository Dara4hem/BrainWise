import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Table,
  Modal,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import AnimatedWrapper from "../components/AnimatedWrapper";
import SearchBar from "../components/SearchBar";
import { useNotification } from "../context/NotificationContext";

const CompaniesList: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
  const [deleteCompanyId, setDeleteCompanyId] = useState<number | null>(null);
  const userRole = localStorage.getItem("userRole");

  // Hook للإشعارات
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchCompanies();
  }, []);

  // جلب قائمة الشركات
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
      setFilteredCompanies(data); // نسخة للبحث
      addNotification("Companies loaded successfully!", "success");
    } catch (err: any) {
      setError(err.message || "Error fetching companies. Please try again.");
      addNotification(err.message || "Error fetching companies.", "error");
    } finally {
      setLoading(false);
    }
  };

  // دالة البحث
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCompanies(companies);
      return;
    }
    const filtered = companies.filter((comp) =>
      comp.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  // إضافة أو تحديث شركة
  const handleAddOrUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!["admin", "manager"].includes(userRole || "")) {
      setError("You do not have permission to perform this action.");
      addNotification("Permission denied", "error");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const method = editCompanyId ? "PUT" : "POST";
    const url = editCompanyId
      ? `http://127.0.0.1:8000/api/companies/${editCompanyId}/`
      : "http://127.0.0.1:8000/api/companies/";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: companyName }),
      });

      if (!response.ok) {
        throw new Error("Error saving company. Please try again.");
      }

      setShowModal(false);
      setCompanyName("");
      setEditCompanyId(null);
      fetchCompanies();
      setShowSuccessModal(true);

      addNotification(
        editCompanyId ? "Company updated successfully!" : "Company added successfully!",
        "success"
      );
    } catch (err: any) {
      setError(err.message || "Error saving company. Please try again.");
      addNotification(err.message || "Error saving company.", "error");
    }
  };

  // تأكيد الحذف
  const handleConfirmDelete = async () => {
    if (deleteCompanyId !== null) {
      if (!["admin", "manager"].includes(userRole || "")) {
        setError("You do not have permission to delete companies.");
        addNotification("Permission denied", "error");
        return;
      }

      const token = localStorage.getItem("accessToken");
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/companies/${deleteCompanyId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error deleting company. Please try again.");
        }

        setShowDeleteModal(false);
        fetchCompanies();
        setShowSuccessModal(true);
        addNotification("Company deleted successfully!", "success");
      } catch (err: any) {
        setError(err.message || "Error deleting company. Please try again.");
        addNotification(err.message || "Error deleting company.", "error");
      }
    }
  };

  return (
    <AnimatedWrapper>
      <Container>
        <h2 className="mb-4 text-center">Companies List</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* شريط البحث عن الشركة بالاسم */}
        <SearchBar
          placeholder="Search companies by name..."
          onSearch={handleSearch}
        />

        {["admin", "manager"].includes(userRole || "") && (
          <Button className="mb-3" onClick={() => setShowModal(true)}>
            + Add Company
          </Button>
        )}

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
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company: any) => (
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

        {/* مودال إضافة/تعديل الشركة */}
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

        {/* مودال تأكيد الحذف */}
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

        {/* مودال نجاح العملية */}
        <Modal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
          centered
        >
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
    </AnimatedWrapper>
  );
};

export default CompaniesList;
