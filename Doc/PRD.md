Product Requirements Document (PRD)

Product Name:
Simple Full-Stack Finance Dashboard

Purpose:
Build a simple, readable, and beginner-friendly full-stack web application using Next.js
that includes authentication, a dashboard, and monthly financial data management.

Primary Goals:
- Allow users to register and log in
- Protect private pages
- Show a simple dashboard summary
- Allow users to enter monthly financial data
- Store all data in MongoDB
- Keep the code simple, readable, and well-commented

Target Audience:
Beginner developers who want to understand how frontend, backend, and database work together.

Core Features:
1. User Registration (email + password)
2. User Login
3. Authentication protection for private pages
4. Dashboard page showing:
   - Total number of users
   - Total number of financial records
5. Monthly finance data entry form
6. Data storage in MongoDB
7. Simple UI built with shadcn/ui

User Flow:
1. User opens the application
2. User registers an account
3. User logs in
4. User is redirected to the dashboard
5. User sees summary data
6. User navigates to finance page
7. User enters monthly financial data
8. Data is saved in the database
9. User can return to dashboard

Non-Goals (Out of Scope):
- Payments
- Charts and analytics
- Admin roles
- OAuth login (Google, GitHub)
- Email verification

Success Criteria:
- Application runs locally without errors
- Registration and login work correctly
- Data is stored and retrieved from MongoDB
- Code is easy to understand by a beginner
- No unnecessary complexity
