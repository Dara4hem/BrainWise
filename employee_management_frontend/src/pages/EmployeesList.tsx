import React, { useEffect, useState } from "react";
import { Button, Container, Table, Modal, Spinner } from "react-bootstrap";

const EmployeesList: React.FC = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://127.0.0.1:8000/api/employees/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Employees Data:", data); // ✅ التأكد من أن البيانات تصل بشكل صحيح
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteEmployeeId !== null) {
      const token = localStorage.getItem("accessToken");
      await fetch(`http://127.0.0.1:8000/api/employees/${deleteEmployeeId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowDeleteModal(false);
      fetchEmployees();
      setShowSuccessModal(true);
    }
  };

  return (
    <Container>
      <h2 className="mb-4 text-center">Employees List</h2>

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
              <th>Email</th>
              <th>Role</th>
              <th>Company</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp: any) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.user?.username || "N/A"}</td>
                  <td>{emp.user?.email || "N/A"}</td>
                  <td>{emp.user?.role || "N/A"}</td>
                  <td>{emp.company || "N/A"}</td>
                  <td>{emp.department || "N/A"}</td>
                  <td>{emp.designation || "N/A"}</td>
                  <td>
                    <span
                      className={`badge ${
                        emp.status === "pending"
                          ? "bg-warning"
                          : emp.status === "hired"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setDeleteEmployeeId(emp.id);
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
                <td colSpan={9} className="text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* ✅ Modal تأكيد الحذف */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this employee?</Modal.Body>
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

export default EmployeesList;
