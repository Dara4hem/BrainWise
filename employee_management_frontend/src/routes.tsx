import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeesList from "./pages/EmployeesList";
import CompaniesList from "./pages/CompaniesList";
import CompanyForm from "./pages/CompanyForm";
import Departments from "./pages/Departments";
import DepartmentForm from "./pages/DepartmentForm";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound"; // New NotFound component
import { JSX } from "react";

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem("accessToken");
  return token ? element : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

        <Route path="/employees" element={<PrivateRoute element={<EmployeesList />} />} />

        <Route path="/companies" element={<PrivateRoute element={<CompaniesList />} />} />
        <Route path="/companies/add" element={<PrivateRoute element={<CompanyForm />} />} />
        <Route path="/companies/edit/:id" element={<PrivateRoute element={<CompanyForm />} />} />

        <Route path="/departments" element={<PrivateRoute element={<Departments />} />} />
        <Route path="/departments/add" element={<PrivateRoute element={<DepartmentForm />} />} />
        <Route path="/departments/edit/:id" element={<PrivateRoute element={<DepartmentForm />} />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
