import React, { useEffect, useState } from "react";
import { Button, Container, Table, Modal, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DepartmentsList: React.FC = () => {
  const [departments, setDepartments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ✅ جلب الأقسام من API
  const fetchDepartments = async () => {
    try {
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
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ✅ حذف القسم
  const handleConfirmDelete = async () => {
    if (deleteDepartmentId !== null) {
      try {
        const token = localStorage.getItem("accessToken");
        await fetch(`http://127.0.0.1:8000/api/departments/${deleteDepartmentId}/`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setShowDeleteModal(false);
        fetchDepartments();
      } catch (err: any) {
        setError("Failed to delete department");
      }
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Department Management</h2>

      {/* ✅ زر إضافة قسم جديد */}
      <div className="mb-3 text-end">
        <Button variant="primary" onClick={() => navigate("/departments/add")}>
          + Add Department
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.length > 0 ? (
            departments.map((dept: any) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                <td>{dept.company_name}</td> {/* ✅ عرض اسم الشركة */}
                <td>
                  {/* ✅ زر تعديل القسم */}
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/departments/edit/${dept.id}`)}
                  >
                    Edit
                  </Button>

                  {/* ✅ زر حذف القسم */}
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

      {/* ✅ Modal تأكيد الحذف */}
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
    </Container>
  );
};

export default DepartmentsList;
