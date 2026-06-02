# МедИнфо (MedInfo)

Медицински вести портал за Северна Македонија.

## Tech Stack

**Frontend:** React 18, React Router v6, Context API, CSS  
**Backend:** Node.js, Express.js, JWT, bcrypt  
**Database:** PostgreSQL

## Quick Start

```bash
# 1. Clone
git clone https://github.com/PresilskiAleksandar/Medical-Newspaper.git
cd Medical-Newspaper

# 2. Install dependencies
cd server && npm install
cd ../client && npm install
cd ..

# 3. Setup PostgreSQL
#    Create database "medinfo", then:
psql -U postgres -d medinfo -f database/schema.sql
node server/seed.js

# 4. Configure server/.env
PORT=5000
DATABASE_URL=postgresql://postgres:Test12345!@localhost:5433/medinfo
JWT_SECRET=medinfo_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880

# 5. Start
cd server && npm run dev     # Backend :5000
cd client && npm start       # Frontend :3000
```

## Default Admin

**Email:** `admin@medinfo.mk`  
**Password:** `admin123`

## Features

- Рolyute / Recenten / Пребарување / Категории
- Коментари / Омилени
- Админ панел: вести, категории, коментари, корисници
- Dark mode / Responsive / Македонски јазик
