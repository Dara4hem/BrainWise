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
2. **Day 2**: Created the **frontend** using React (with React Router, Bootstrap).  
3. **Day 3**: Implemented **bonus features** such as Chatbot integration (with local docs and GitHub code fetching) and an Employee status workflow.  
4. **Day 4**: **Refinements**: improved UI, tested endpoints, finalized documentation, and prepared for deployment.

---

## Backend (Django)

### Overview

- **Framework**: Django REST Framework.  
- **Authentication**: JWT-based, using `rest_framework_simplejwt`.  
- **Database**: SQLite by default (can be swapped for PostgreSQL).  
- **Core App**: `api`, containing models, serializers, views, permissions, and tests.

### File Structure

backend/ ├── manage.py ├── backend/ │ ├── settings.py │ ├── urls.py │ ├── wsgi.py │ └── asgi.py └── api/ ├── admin.py ├── apps.py ├── chat.py ├── documentation/ │ ├── backend.pdf │ └── frontend.pdf ├── models.py ├── permissions.py ├── serializers.py ├── tests.py ├── urls.py └── views.py

markdown
Copy

### Key Backend Files

- **`models.py`**: Defines:
  - `Company` (name, unique).
  - `User` (extends `AbstractUser`, adds `role` and optional `company`).
  - `Department` (belongs to `Company`).
  - `Employee` (OneToOne with `User`, has `status` like `pending`, `hired`, etc.).
- **`permissions.py`**: Custom DRF permissions for admin, manager, employee.  
- **`serializers.py`**: Converts models to/from JSON; includes validation logic (e.g., department must match the company).  
- **`views.py`**: 
  - **ViewSets** for `User`, `Company`, `Department`, `Employee`.
  - **Role-based filtering** (admin sees all, manager sees only their company, employee sees personal data).
  - Additional endpoints for retrieving user info and a chatbot endpoint (`chat_with_bot`).  
- **`urls.py`** (`api/urls.py`): Uses `DefaultRouter` to register routes:
  - `/api/users/`, `/api/companies/`, `/api/departments/`, `/api/employees/`.
  - Also includes `/api/token/` for JWT, `/api/user/` for user data, and `/chatbot/`.
- **`chat.py`**: 
  - Loads **local docs** (`backend.pdf`, `frontend.pdf`) and **README** from GitHub.
  - On queries like “backend doc,” returns local doc text; on “employees code,” fetches code from GitHub.
  - Falls back to Mistral AI with the README for general questions.

---

## Frontend (React)

### Overview

- **Framework**: React with TypeScript.  
- **Routing**: React Router for page-based navigation.  
- **Styling**: Bootstrap for quick UI components and custom CSS.  
- **Authentication**: Stores JWT in `localStorage`; uses a PrivateRoute to guard routes.

### File Structure

employee_management_frontend/ ├── src/ │ ├── components/ │ │ └── ChatWidget.tsx │ ├── pages/ │ │ ├── Login.tsx │ │ ├── Dashboard.tsx │ │ ├── EmployeesList.tsx │ │ ├── CompaniesList.tsx │ │ ├── ... │ ├── routes.tsx │ ├── App.tsx │ ├── main.tsx │ └── index.css └── package.json

markdown
Copy

### Key Frontend Files

- **`main.tsx`**: Renders `<App />` into the DOM, imports global CSS.  
- **`App.tsx`**: Wraps `<AppRoutes />` and possibly context providers.  
- **`routes.tsx`**: Defines `BrowserRouter`, along with `<Route />` components for each page.  
- **`Login.tsx`**: Sends credentials to `/api/token/`, stores `accessToken` in `localStorage`, fetches user role.  
- **`EmployeesList.tsx`, `CompaniesList.tsx`, etc.**: CRUD pages for each resource, using fetch calls to the backend.  
- **`ChatWidget.tsx`**: 
  - Floating chat button. 
  - Renders messages, including code blocks if triple backticks are detected. 
  - Scroll-to-bottom feature, typing indicator, and multi-step greetings.

---

## Documentation & Chatbot Integration

1. **Local Docs**: 
   - `backend.pdf` and `frontend.pdf` in `api/documentation/`.
   - `chat.py` parses them with PyPDF2, so the user can say “backend doc” or “frontend doc” to see them.
2. **README**: 
   - Fetched from GitHub (`fetch_readme_from_github()`).
   - If the user asks a question not matched by “backend doc” or “frontend doc” or code triggers, the bot uses Mistral AI with the README context.
3. **GitHub Code Fetching**: 
   - If user says “employees code” or “كود الموظفين,” the bot fetches `views.py` from GitHub, extracts relevant lines with a keyword-based approach.

---

## Testing & Workflow

1. **Tests**:
   - `tests.py` includes unit tests for models and integration tests for endpoints.
   - Example: Employee workflow test ensures status transitions are valid (`pending` → `hired`) or invalid (`pending` → `not_accepted`).
2. **Employee Status Workflow**:
   - `Employee` model has a `status` field with states like `pending`, `hired`, `not_accepted`.
   - The system can restrict transitions (like “pending” → “hired” is valid, but “pending” → “not_accepted” might also be valid, etc.).
   - This logic is typically in a method like `change_status(new_status)`.

---

## Role-Based Access Control

- **Admin**:
  - Full access to all companies, departments, employees.
  - Can create or delete any resource.
- **Manager**:
  - Sees only the company they belong to.
  - Can create departments, hire employees, and manage them in that company.
- **Employee**:
  - Sees only their personal data.
  - Cannot manage others’ records.

These rules are enforced both in the **backend** (through custom queries in `views.py`) and optionally in the **frontend** (hiding certain UI elements).

---

## How to Run

### Backend

1. **Clone** the repo:
   ```sh
   git clone https://github.com/Dara4hem/BrainWise.git
   cd BrainWise/employee_management
Create & activate a virtual environment:
sh
Copy
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
Install dependencies:
sh
Copy
pip install -r requirements.txt
Migrate & run:
sh
Copy
python manage.py migrate
python manage.py runserver
Frontend
Go to the frontend folder:
sh
Copy
cd ../employee_management_frontend
Install:
sh
Copy
npm install
Run:
sh
Copy
npm run dev
Visit http://127.0.0.1:5173 (or the displayed port).
Day-by-Day Development
Day 1:
Set up Django, created models (Company, User, Department, Employee),
Configured rest_framework_simplejwt for JWT tokens,
Created initial endpoints for CRUD.
Day 2:
Built a React app, added pages for login, employees, companies, etc.
Implemented role-based rendering in the frontend (private routes).
Day 3:
Added bonus features:
Chatbot integration: local docs, GitHub code fetching, fallback to README + Mistral AI.
Employee workflow with status transitions.
Additional tests (workflow transitions, role-based endpoints).
Day 4:
Polished UI:
Code blocks in chat, scroll-to-bottom, typing indicator.
Final docstrings, logging, and documentation (this README).
Confirmed end-to-end usage and performance.
Conclusion
The Employee Management System showcases:

A robust backend with Django REST Framework, JWT authentication, and role-based access.
A clean frontend built in React with route protection, CRUD pages, and dynamic UI based on user roles.
A powerful chatbot that can retrieve code from GitHub, read local PDF docs, or fallback to a README-based AI for advanced questions.
Workflow logic for employee status transitions and integrated tests for reliability.
By following the instructions above, you can install and run the system locally. The code is well-structured, documented, and includes bonus features (chatbot integration, advanced role-based logic, employee workflow) that demonstrate a complete, polished solution.

Developer: Mustafa Darahem
Email: mostafasamirdarahem@gmail.com


