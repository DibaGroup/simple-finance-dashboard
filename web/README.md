# Simple Finance Dashboard

A beginner-friendly full-stack web application built with Next.js that demonstrates authentication, database operations, and form handling.

## Features

✅ User Registration & Login (JWT-based authentication)  
✅ Protected Dashboard with metrics  
✅ Monthly Finance Data Entry (Income & Expenses)  
✅ MongoDB Integration with Mongoose  
✅ Form Validation with Zod  
✅ Modern UI with shadcn/ui Components

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT tokens in httpOnly cookies
- **Forms**: React Hook Form + Zod validation
- **UI**: shadcn/ui + Tailwind CSS
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the project root:

```env
# MongoDB Connection (REQUIRED)
MONGODB_URI=your_mongodb_connection_string

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-secret-key-change-in-production

# Optional: App URL (defaults to http://localhost:3000)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting MongoDB URI:**

- **Local MongoDB**: `mongodb://localhost:27017/finance-dashboard`
- **MongoDB Atlas**: Get connection string from your Atlas cluster

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/
│   │   │   ├── register/       # User registration endpoint
│   │   │   ├── login/          # User login endpoint
│   │   │   └── logout/         # User logout endpoint
│   │   └── finance/            # Finance CRUD endpoints
│   ├── register/               # Registration page
│   ├── login/                  # Login page
│   ├── dashboard/              # Protected dashboard page
│   ├── finance/                # Protected finance entry page
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── lib/
│   ├── auth.ts                 # Authentication utilities
│   ├── db.ts                   # MongoDB connection helper
│   ├── utils.ts                # Utility functions
│   └── models/
│       ├── User.ts             # User schema
│       └── FinanceRecord.ts    # Finance record schema
├── components/
│   └── ui/                     # shadcn/ui components
└── .env.local                  # Environment variables (create this)
```

## Key Concepts for Beginners

### Authentication Flow

1. **Register**: User submits email/password → API hashes password → Saves to MongoDB
2. **Login**: User submits credentials → API verifies → Issues JWT token as httpOnly cookie
3. **Protected Routes**: Server checks JWT cookie → Allows/denies access

### Database Models

- **User**: Stores email and hashed password
- **FinanceRecord**: Links to user, stores month, income, and expense

### Form Validation

- Client-side validation with Zod schemas
- Server-side validation in API routes
- Clear error messages for users

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Usage Guide

### 1. Register an Account

- Go to `/register`
- Enter email and password (min 6 characters)
- Password is automatically hashed before storage

### 2. Log In

- Go to `/login`
- Enter your credentials
- JWT token is stored in httpOnly cookie

### 3. View Dashboard

- See total users and finance records
- Access protected content
- Log out when done

### 4. Add Finance Records

- Go to `/finance`
- Enter month in YYYY-MM format (e.g., 2026-01)
- Add income and expense amounts
- View all your records in the table below

## Security Notes

- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens stored in httpOnly cookies (prevents XSS)
- Environment variables used for sensitive data
- Server-side authentication checks on protected routes

## Learning Resources

This project demonstrates:

- Next.js App Router with Server Components
- MongoDB integration with Mongoose
- JWT authentication without external libraries
- Form handling with React Hook Form
- Type-safe validation with Zod
- Modern UI patterns with Tailwind CSS

## Troubleshooting

**MongoDB Connection Error:**

- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB service is running (local) or cluster is active (Atlas)

**Build Errors:**

- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (18+ required)

**Authentication Issues:**

- Clear browser cookies
- Verify `JWT_SECRET` is set in `.env.local`

## Next Steps

- Add update/delete functionality for finance records
- Implement data visualization with charts
- Add email verification
- Implement password reset flow
- Add user profile management

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

//MONGODB_URI=mongodb+srv://fardibavar_db_user:9uiGDjGwZYPdxRgf@myfirstdb.h83zkma.mongodb.net/sample_mflix?retryWrites=true&w=majority&appName=myfirstDB
