# Employee Management System

## 📌 Overview

The **Employee Management System** is a full-stack web application designed to streamline employee management within organizations. It provides role-based access to administrators, managers, and employees, allowing them to manage companies, departments, and employee records efficiently. The project includes a **frontend (React)** and a **backend (Django REST Framework)** with JWT authentication.

## 📅 Project Timeline

- **Day 1**: Backend development (Django, API setup, database design).
- **Day 2**: Frontend development (React, UI components, API integration).
- **Day 3**: Final refinements, chatbot integration, and documentation.

---

## 🖥️ Backend (Django)

### 🔹 Technologies Used

- **Django** (REST Framework)
- **SQLite3** (Database)
- **JWT Authentication** (Secure login)
- **Django Admin Panel**

### 🔹 Features Implemented

✅ **User Authentication & Role-Based Access**

- Admins: Full control over the system.
- Managers: Can manage employees and departments in their assigned companies.
- Employees: Can view their own profile but cannot edit other data.

✅ **Company & Department Management**

- Admins can create, edit, and delete companies.
- Managers can create and manage departments in their assigned company.

✅ **Employee Management**

- Managers can hire and assign employees to departments.
- Employees can view their own details but cannot modify them.

✅ **Secure API Endpoints**

- Implemented token-based authentication using JWT.
- Restricted access to different endpoints based on user roles.

✅ **GitHub Chatbot Integration**

- Users can ask questions about the project.
- The bot first checks **README.md** for answers.
- If more details are needed, it fetches information from the GitHub repository.

### 🔹 API Endpoints

| Method | Endpoint            | Description                        |
| ------ | ------------------- | ---------------------------------- |
| `POST` | `/api/token/`       | Obtain JWT token                   |
| `GET`  | `/api/users/`       | List all users (admin only)        |
| `GET`  | `/api/employees/`   | List employees (based on role)     |
| `POST` | `/api/employees/`   | Add a new employee (manager only)  |
| `GET`  | `/api/companies/`   | View companies (admin & manager)   |
| `GET`  | `/api/departments/` | View departments (admin & manager) |
| `POST` | `/api/departments/` | Create department (manager only)   |

---

## 🎨 Frontend (React)

### 🔹 Technologies Used

- **React.js**
- **Bootstrap** (UI Styling)
- **React Router** (Navigation)
- **JWT Authentication Handling**

### 🔹 Features Implemented

✅ **Login & Authentication**

- Users log in using email or username.
- JWT token is stored securely.

✅ **Dashboard with Role-Based UI**

- Admin: Can see all data.
- Manager: Can view and manage assigned employees and departments.
- Employee: Can view personal details only.

✅ **CRUD Operations**

- Managers can add/edit/delete employees within their company.
- Admins can manage companies and assign managers.

✅ **Chatbot Integration**

- Allows users to ask questions about the project.
- Retrieves answers from **README.md** first, then GitHub if needed.

---

## 🚀 How to Run the Project

### 🔹 Backend Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/Dara4hem/BrainWise.git
   cd BrainWise/employee_management
   ```
2. Create and activate a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Apply migrations and run the server:
   ```sh
   python manage.py migrate
   python manage.py runserver
   ```

### 🔹 Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd ../employee_management_frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

---

## 🔹 Chatbot Feature (Smart Documentation Assistant)

✅ **How it Works**

- Users ask questions about the project.
- The chatbot first searches **README.md** locally.
- If more details are needed, it fetches from GitHub.
- The response is generated using **Mistral AI** for natural language processing.

✅ **Example Questions**

- "How did Mustafa implement employee management?"
- "What authentication method is used?"
- "Can managers add companies?"

✅ **Expanding Chatbot Functionality**

- Future updates may include searching through project source code for advanced queries.

---

## 🔮 Future Improvements

- **Enhancing Chatbot**: Adding NLP processing for better query understanding.
- **User-Friendly UI**: Improving styling and animations.
- **Database Optimization**: Shifting to PostgreSQL for better scalability.
- **Role-Based Permissions**: Adding finer-grained permission controls.

---

## 👨‍💻 Developer: Mustafa Darahem

For any inquiries, contact me at: [Your Email]

---

This project was designed to demonstrate my ability to create a full-stack system with **efficient authentication, user roles, and a chatbot assistant.** 🚀🔥

