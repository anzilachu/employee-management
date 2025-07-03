Employee Management System

A full-stack Employee Management System with:
    Django REST API (backend)
    React (frontend)
    JWT authentication
    Dynamic form builder
    Employee CRUD with dynamic fields

Features
1. User Authentication: Register, login, JWT-based auth, profile, change password
2. Dynamic Form Builder: Create forms with custom fields (text, number, date, password), drag-and-drop field order
3. Employee Management: Create, update, list, search, and delete employees using dynamic forms
4. Search & Filter: Search employees by any field
5. Modern UI: Clean, responsive React frontend


🛠️ Backend (Django)

Setup

1. Go to the backend folder:
   ```sh
   cd backend
   ```

2. Create and activate a virtual environment:
   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
   *(If `requirements.txt` is missing, install: `django djangorestframework djangorestframework-simplejwt django-cors-headers`)*

4. Run migrations:
   ```sh
   python manage.py migrate
   ```

5. Create a superuser (optional, for admin):
   ```sh
   python manage.py createsuperuser
   ```

6. Start the server:
   ```sh
   python manage.py runserver
   ```

### API Endpoints**

- Auth: 
  - `POST /api/auth/register/`  
  - `POST /api/auth/login/`  
  - `POST /api/auth/token/refresh/`  
  - `GET /api/auth/profile/`  
  - `POST /api/auth/change-password/`  

- Dynamic Forms: 
  - `GET/POST /api/forms/forms/`  
  - `PUT/DELETE /api/forms/forms/:id/`  

- Employees:  
  - `GET/POST /api/employees/employees/`  
  - `PUT/DELETE /api/employees/employees/:id/`  
  - **Search:** Use query params, e.g. `/api/employees/employees/?form=1&field_name=John`

- JWT Auth:
  - Add `Authorization: Bearer <access_token>` to protected requests.

---

💻 Frontend (React)

### Setup

1. Go to the frontend folder:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

