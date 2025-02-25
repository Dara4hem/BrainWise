# Employee Management System

This **Employee Management System** is a comprehensive full-stack web application that streamlines employee management within organizations. It supports **role-based access** (Admin, Manager, Employee), **CRUD** operations for Companies, Departments, and Employees, and includes an **AI-powered Chatbot** for quick project queries. Below you will find all the details about the system’s architecture, bonus features, and a day-by-day timeline of its development.

---

## Table of Contents

1. [Project Timeline](#project-timeline)  
2. [Backend (Django)](#backend-django)  
3. [Frontend (React)](#frontend-react)  
4. [Documentation & Chatbot Integration](#documentation--chatbot-integration)  
5. [Testing & Workflow](#testing--workflow)  
6. [Role-Based Access Control](#role-based-access-control)  
7. [How to Run](#how-to-run)  
8. [Day-by-Day Development](#day-by-day-development)  
9. [Conclusion](#conclusion)  

---

## Project Timeline

1. **Day 1**: Built the **backend** with Django REST Framework (DRF).  
2. **Day 2**: Created the **frontend** using React (with React Router and Bootstrap).  
3. **Day 3**: Implemented **bonus features** such as Chatbot integration (with local docs and GitHub code fetching) and an Employee status workflow.  
4. **Day 4**: **Refinements**: improved UI, tested endpoints, finalized documentation, and prepared for deployment.

---

## Backend (Django)

### Overview

- **Framework**: Django REST Framework  
- **Authentication**: JWT-based, using `rest_framework_simplejwt`  
- **Database**: SQLite by default (can switch to PostgreSQL)  
- **Core App**: `api`, containing models, serializers, views, permissions, and tests

### File Structure

```
backend/
├── manage.py
├── backend/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
└── api/
    ├── admin.py
    ├── apps.py
    ├── chat.py
    ├── documentation/
    │   ├── backend.pdf
    │   └── frontend.pdf
    ├── models.py
    ├── permissions.py
    ├── serializers.py
    ├── tests.py
    ├── urls.py
    └── views.py
```

### Key Backend Features

- **JWT Authentication** for secure access
- **Custom Role-Based Permissions** for Admins, Managers, and Employees
- **AI Chatbot Integration** with local docs and GitHub code fetching
- **Comprehensive API** with DRF ViewSets and role-based filtering
- **Employee Workflow** with status transitions

---

## Frontend (React)

### Overview

- **Framework**: React with TypeScript  
- **Routing**: React Router for page-based navigation  
- **Styling**: Bootstrap for quick UI and custom CSS  
- **Authentication**: Stores JWT in `localStorage`; uses PrivateRoute to guard routes

### File Structure

```
employee_management_frontend/
├── src/
│   ├── components/
│   │   └── ChatWidget.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EmployeesList.tsx
│   │   ├── CompaniesList.tsx
│   │   ├── ...
│   ├── routes.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
└── package.json
```

### Key Frontend Features

- **User-Friendly Dashboard** with role-based navigation
- **JWT Authentication & Protected Routes**
- **Chatbot Widget** for instant project assistance
- **Responsive Design** using Bootstrap

---

## Documentation & Chatbot Integration

- **Local Docs**: `backend.pdf` and `frontend.pdf` for quick access to documentation.
- **GitHub README Fetching**: Pulls documentation dynamically.
- **Code Fetching**: Extracts relevant code snippets based on user queries.

---

## Testing & Workflow

1. **Unit & Integration Tests** for API endpoints and business logic.
2. **Employee Status Workflow** ensures valid transitions (e.g., `pending → hired`).

---

## Role-Based Access Control

| Role     | Access |
|----------|--------|
| **Admin**  | Full access to companies, employees, and departments |
| **Manager**  | Manages their company’s employees and departments |
| **Employee**  | Can view only their own profile |

---

## How to Run

### Backend

```bash
git clone https://github.com/Dara4hem/BrainWise.git
cd BrainWise/employee_management
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd ../employee_management_frontend
npm install
npm run dev
```

Visit: `http://127.0.0.1:5173`

---

## Day-by-Day Development

| Day | Task |
|-----|------|
| **1** | Backend setup, models, and API endpoints |
| **2** | Frontend setup, authentication, and UI components |
| **3** | Bonus features: Chatbot, GitHub fetching, workflow tests |
| **4** | UI enhancements, final testing, documentation |

---

## Conclusion

This project demonstrates:

✅ **Full-stack architecture** with Django & React  
✅ **JWT authentication** with role-based permissions  
✅ **AI-powered Chatbot** for documentation and code retrieval  
✅ **Employee workflow management**  
✅ **Comprehensive test coverage**  

**Developer**: Mustafa Darahem  
**Email**: mostafasamirdarahem@gmail.com
