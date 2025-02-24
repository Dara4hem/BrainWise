import React, { useEffect, useState } from "react";
import { Button, Container, Table, Modal, Form } from "react-bootstrap";

const DepartmentsList: React.FC = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteDepartmentId, setDeleteDepartmentId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const fetchDepartments = async () => {
    const token = localStorage.getItem("accessToken");
    const response = await fetch("http://127.0.0.1:8000/api/departments/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setDepartments(data);
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return;

    const token = localStorage.getItem("accessToken");
    const response = await fetch("http://127.0.0.1:8000/api/departments/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: newDepartment }),
    });

    if (response.ok) {
      setNewDepartment("");
      fetchDepartments();
      setShowSuccessModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteDepartmentId !== null) {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://127.0.0.1:8000/api/departments/${deleteDepartmentId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowDeleteModal(false);
      fetchDepartments();
      setShowSuccessModal(true);
    }
  };

  return (
    <Container>
      <h2 className="mb-4 text-center">Departments List</h2>

      {/* ✅ نموذج إضافة قسم (للمدير فقط) */}
      {(userRole === "admin" || userRole === "manager") && (
        <Form className="mb-3 d-flex">
          <Form.Control
            type="text"
            placeholder="Enter department name"
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
          <Button variant="primary" className="ms-2" onClick={handleAddDepartment}>
            Add Department
          </Button>
        </Form>
      )}

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            {userRole === "admin" || userRole === "manager" ? <th>Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {departments.length > 0 ? (
            departments.map((dept: any) => (
              <tr key={dept.id}>
                <td>{dept.id}</td>
                <td>{dept.name}</td>
                {(userRole === "admin" || userRole === "manager") && (
                  <td>
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
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={userRole === "admin" || userRole === "manager" ? 3 : 2} className="text-center">
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

export default DepartmentsList;
