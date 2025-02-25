import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Table,
  Modal,
  Spinner,
  Alert,
} from "react-bootstrap";
import AnimatedWrapper from "../components/AnimatedWrapper";
import SearchBar from "../components/SearchBar";
import { useNotification } from "../context/NotificationContext";

const EmployeesList: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Hook للإشعارات
  const { addNotification } = useNotification();

  useEffect(() => {
    fetchEmployees();
  }, []);

  // جلب الموظفين
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

      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }

      const data = await response.json();
      setEmployees(data);
      setFilteredEmployees(data); // نسخة لعملية البحث
      addNotification("Employees loaded successfully!", "success");
    } catch (err: any) {
      setError(err.message || "Error fetching employees");
      addNotification(err.message || "Error fetching employees", "error");
    } finally {
      setLoading(false);
    }
  };

  // دالة البحث
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredEmployees(employees);
      return;
    }
    const filtered = employees.filter((emp) =>
      emp.user?.username?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  // تأكيد الحذف
  const handleConfirmDelete = async () => {
    if (deleteEmployeeId !== null) {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(
          `http://127.0.0.1:8000/api/employees/${deleteEmployeeId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete employee");
        }

        setShowDeleteModal(false);
        fetchEmployees(); // إعادة الجلب لتحديث القائمة
        setShowSuccessModal(true);
        addNotification("Employee deleted successfully!", "success");
      } catch (err: any) {
        setError(err.message || "Error deleting employee");
        addNotification(err.message || "Error deleting employee", "error");
      }
    }
  };

  return (
    <AnimatedWrapper>
      <Container>
        <h2 className="mb-4 text-center">Employees List</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {/* SearchBar للبحث عن الموظفين بالاسم */}
            <SearchBar
              placeholder="Search employees by name..."
              onSearch={handleSearch}
            />

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
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp: any) => (
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
          </>
        )}

        {/* Modal تأكيد الحذف */}
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

        {/* Modal نجاح العملية */}
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

export default EmployeesList;
