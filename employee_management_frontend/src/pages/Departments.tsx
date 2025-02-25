import React, { useEffect, useState } from "react";
import { Button, Container, Table, Modal, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AnimatedWrapper from "../components/AnimatedWrapper";
import SearchBar from "../components/SearchBar";
import { useNotification } from "../context/NotificationContext";

const DepartmentsList: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  
  // Hook للإشعارات
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchDepartments();
  }, []);

  // جلب قائمة الأقسام
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://127.0.0.1:8000/api/departments/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch departments");

      const data = await response.json();
      setDepartments(data);
      setFilteredDepartments(data); // نسخة للبحث
      addNotification("Departments loaded successfully!", "success");
    } catch (err: any) {
      setError(err.message || "Failed to fetch departments");
      addNotification(err.message || "Failed to fetch departments", "error");
    } finally {
      setLoading(false);
    }
  };

  // دالة البحث
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredDepartments(departments);
      return;
    }
    const filtered = departments.filter((dept: any) =>
      dept.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredDepartments(filtered);
  };

  // تأكيد الحذف
  const handleConfirmDelete = async () => {
    if (deleteDepartmentId !== null) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://127.0.0.1:8000/api/departments/${deleteDepartmentId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to delete department");

        setShowDeleteModal(false);
        setShowSuccessModal(true);
        addNotification("Department deleted successfully!", "success");
        fetchDepartments();
      } catch (err: any) {
        setError("Failed to delete department");
        addNotification("Failed to delete department", "error");
      }
    }
  };

  return (
    <AnimatedWrapper>
      <Container className="mt-4">
        <h2 className="mb-4 text-center">Department Management</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            <div className="mb-3 text-end">
              <Button variant="primary" onClick={() => navigate("/departments/add")}>
                + Add Department
              </Button>
            </div>

            {/* SearchBar للبحث بالاسم */}
            <SearchBar
              placeholder="Search departments by name..."
              onSearch={handleSearch}
            />

            <Table striped bordered hover responsive className="mt-3">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.length > 0 ? (
                  filteredDepartments.map((dept: any) => (
                    <tr key={dept.id}>
                      <td>{dept.id}</td>
                      <td>{dept.name}</td>
                      <td>{dept.company_name}</td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => navigate(`/departments/edit/${dept.id}`)}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            setDeleteDepartmentId(dept.id);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </>
        )}

        {/* مودال تأكيد الحذف */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this department?</Modal.Body>
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
    </AnimatedWrapper>
  );
};

export default DepartmentsList;
