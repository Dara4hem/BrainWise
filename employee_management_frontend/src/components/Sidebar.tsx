import React from "react";
import { Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBuilding,
  FaFolder,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; 

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div
      className={`d-flex flex-column vh-100 text-white p-3 sidebar-container ${
        theme === "dark" ? "bg-secondary" : "bg-dark"
      }`}
      style={{ width: "250px" }}
    >
      <h4 className="mb-4 text-center">⚡ Admin Panel</h4>

      <Nav className="flex-column">
        <Nav.Link as={Link} to="/employees" className="text-white mb-2">
          <FaUsers className="me-2" /> Employees
        </Nav.Link>

        <Nav.Link as={Link} to="/companies" className="text-white mb-2">
          <FaBuilding className="me-2" /> Companies
        </Nav.Link>

        {(userRole === "admin" || userRole === "manager") && (
          <Nav.Link as={Link} to="/departments" className="text-white mb-2">
            <FaFolder className="me-2" /> Departments
          </Nav.Link>
        )}
      </Nav>

      <Button
        variant="outline-light"
        className="mt-3"
        onClick={toggleTheme}
      >
        {theme === "light" ? <FaMoon /> : <FaSun />}{" "}
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </Button>

      <Button variant="danger" className="mt-auto w-100" onClick={handleLogout}>
        <FaSignOutAlt className="me-2" /> Logout
      </Button>
    </div>
  );
};

export default Sidebar;
