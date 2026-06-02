# МедИнфо (MedInfo)

Медицински вести портал за Северна Македонија.

## Tech Stack

**Frontend:** React 18, React Router, Context API, CSS  
**Backend:** Node.js, Express.js, JWT, bcrypt  
**Database:** PostgreSQL

## Quick Start

### Prerequisites
- Node.js v18+
- PostgreSQL 14+

### 1. Database
```bash
psql -U postgres -f database/schema.sql
psql -U postgres -d medinfo -f database/seed.sql
```

### 2. Backend
```bash
cd server
npm install
# Edit .env with your database credentials
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
npm start
```

Open http://localhost:3000

## Default Admin
- Email: admin@medinfo.mk
- Password: (generate via register, then manually set role to 'admin' in DB)

## Project Structure
```
medinfo/
├── client/          # React frontend
├── server/          # Express backend
└── database/        # SQL schema + seed
```
