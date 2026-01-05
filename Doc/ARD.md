Architecture & Requirements Document (ARD)

Application Type:
Full-stack Next.js application using App Router

Frontend:
- Framework: Next.js (App Router)
- UI Components: shadcn/ui
- Forms: React Hook Form
- Validation: Zod

Backend:
- API Routes using Next.js route handlers
- Authentication logic inside API routes
- Simple session or token-based protection

Database:
- MongoDB
- ODM: Mongoose

Collections:

1. users
   - email (string, unique)
   - password (hashed string)
   - createdAt (date)

2. financeRecords
   - userId (ObjectId)
   - month (string)
   - income (number)
   - expense (number)
   - createdAt (date)

Folder Structure:

app/
 ├─ register/
 │   └─ page.tsx
 ├─ login/
 │   └─ page.tsx
 ├─ dashboard/
 │   └─ page.tsx
 ├─ finance/
 │   └─ page.tsx
 ├─ api/
 │   ├─ auth/
 │   │   ├─ register/
 │   │   │   └─ route.ts
 │   │   └─ login/
 │   │       └─ route.ts
 │   └─ finance/
 │       └─ route.ts
 ├─ layout.tsx
 └─ page.tsx

lib/
 ├─ db.ts
 └─ models/
     ├─ User.ts
     └─ FinanceRecord.ts

Architecture Principles:
- One responsibility per file
- Keep files small and readable
- Avoid deep nesting
- Use comments to explain logic
- Beginner-friendly structure
