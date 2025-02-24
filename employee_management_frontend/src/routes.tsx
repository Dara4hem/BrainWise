import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeesList from "./pages/EmployeesList";
import CompaniesList from "./pages/CompaniesList";
import CompanyForm from "./pages/CompanyForm";
import Departments from "./pages/Departments";
import DepartmentForm from "./pages/DepartmentForm";
import Profile from "./pages/Profile";
import { JSX } from "react";

// ✅ مكون لحماية المسارات
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const token = localStorage.getItem("accessToken");
  return token ? element : <Navigate to="/" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ تسجيل الدخول */}
        <Route path="/" element={<Login />} />

        {/* ✅ الصفحات الرئيسية (يجب أن يكون المستخدم مسجل الدخول) */}
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />

        {/* ✅ الموظفين */}
        <Route path="/employees" element={<PrivateRoute element={<EmployeesList />} />} />

        {/* ✅ الشركات */}
        <Route path="/companies" element={<PrivateRoute element={<CompaniesList />} />} />
        <Route path="/companies/add" element={<PrivateRoute element={<CompanyForm />} />} />
        <Route path="/companies/edit/:id" element={<PrivateRoute element={<CompanyForm />} />} />

        {/* ✅ الأقسام */}
        <Route path="/departments" element={<PrivateRoute element={<Departments />} />} />
        <Route path="/departments/add" element={<PrivateRoute element={<DepartmentForm />} />} />
        <Route path="/departments/edit/:id" element={<PrivateRoute element={<DepartmentForm />} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
