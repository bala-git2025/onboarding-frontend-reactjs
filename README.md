# Onboarding Frontend ReactJS

This project is a ReactJS frontend application for an employee onboarding system.  
It provides login functionality and role-based dashboards for employees and managers.

## Features
- Login with employee ID and password
- Role-based navigation:
  - Employee Dashboard
  - Manager Dashboard
- Shared layout with Header and Footer
- Responsive design using CSS modules

## Project Structure
src/
├── components/       # Reusable UI components (Header, Footer)
├── layouts/          # MainLayout wrapper with header/footer
├── pages/            # Page-level components (Login, EmployeeDashboard, ManagerDashboard)
├── styles/           # CSS modules for styling
└── services/         # API service functions (authService/employeeService/managerService)

## Getting Started
1. Install dependencies:
   npm install

2. Run the development server:
   npm run dev

3. Open the app in your browser:
   http://localhost:4000

## Notes
- Dashboards are accessible only after login.
- User role determines which dashboard is shown.
- Update `authService.ts` to connect with your backend API.
