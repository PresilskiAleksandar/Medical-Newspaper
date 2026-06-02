# МедИнфо — Full Stack Project Architecture & Setup Prompt

## Overview

Create a complete modern FULL STACK medical news web application called **„МедИнфо“** using:

## Frontend

* ReactJS
* JavaScript
* CSS

## Backend

* Node.js
* Express.js

## Database

* PostgreSQL

The application must be:

* Fully responsive
* Fast and optimized
* Scalable
* Secure
* Modern and visually premium
* Designed specifically for users in North Macedonia

The entire UI, navigation, buttons, forms, notifications, placeholders, labels, validation messages, and demo content must be written in **Macedonian Cyrillic**.

---

# Core Features

## Public Medical News Portal

The public portal must include:

* Homepage with featured medical news
* Latest articles
* Trending articles
* Search functionality
* News categories
* Article details page
* Related articles
* Comment system
* Responsive navigation
* Newsletter subscription section
* Footer with contact information

---

# User Roles

## Reader User

Reader users can:

* Register account
* Login/logout
* Read medical articles
* Search articles
* Filter by category
* Save favorite articles
* Comment on articles
* Edit profile

---

## Admin User

Admin users can:

* Access admin dashboard
* Create news articles
* Edit articles
* Delete articles
* Upload article images
* Manage categories
* Moderate comments
* View analytics
* Manage users

---

# Technology Stack

## Frontend

Use:

* ReactJS
* JavaScript
* CSS
* React Router DOM
* Axios
* Context API

Do NOT use:

* TypeScript
* jQuery
* Bootstrap templates

---

## Backend

Use:

* Node.js
* Express.js
* JWT Authentication
* bcrypt password hashing
* Multer for image uploads
* CORS
* dotenv

Backend architecture must follow modern REST API standards.

---

## Database

Use PostgreSQL.

The database must include relational structure and proper normalization.

Use:

* PostgreSQL
* pg package for Node.js

Prepare structure for easy migration to production hosting.

---

# Design Requirements

Create a premium healthcare-inspired UI using:

* White color palette
* Soft blue colors
* Teal accents
* Light gray backgrounds
* Glassmorphism effects
* Soft shadows
* Rounded corners
* Smooth animations
* Modern typography

The application should visually resemble:

* Premium medical portals
* Modern healthcare SaaS platforms
* Professional digital newspapers

---

# Responsive Design

The application must work perfectly on:

* Desktop
* Tablet
* Mobile devices

Requirements:

* Mobile-first responsive design
* Responsive grids
* Adaptive layouts
* Hamburger mobile navigation
* Touch-friendly UI
* Optimized typography

---

# Project Architecture

Create separate frontend and backend folders.

Example structure:

```plaintext id="y9w3mt"
medinfo/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   └── App.js
│   │
│   └── public/
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── utils/
│   ├── app.js
│   └── server.js
│
└── database/
    ├── schema.sql
    └── seed.sql
```

---

# Authentication System

Implement secure authentication using:

* JWT Tokens
* bcrypt password hashing
* Protected routes
* Role-based access control

Features:

* Register
* Login
* Logout
* Session persistence
* Protected admin routes
* Token validation
* Error handling
* Macedonian validation messages

---

# PostgreSQL Database Schema

Create tables for:

## users

Fields:

* id
* full_name
* email
* password
* role
* created_at

---

## categories

Fields:

* id
* name
* slug
* created_at

---

## articles

Fields:

* id
* title
* slug
* excerpt
* content
* image
* category_id
* author_id
* featured
* created_at
* updated_at

---

## comments

Fields:

* id
* article_id
* user_id
* content
* approved
* created_at

---

## favorites

Fields:

* id
* user_id
* article_id

---

# API Requirements

Create REST API endpoints for:

## Authentication

* POST /api/auth/register
* POST /api/auth/login
* GET /api/auth/profile

---

## Articles

* GET /api/articles
* GET /api/articles/:id
* POST /api/articles
* PUT /api/articles/:id
* DELETE /api/articles/:id

---

## Categories

* GET /api/categories
* POST /api/categories

---

## Comments

* POST /api/comments
* DELETE /api/comments/:id

---

# Admin Dashboard

Create a modern admin dashboard with:

* Statistics cards
* News management table
* Category management
* Comment moderation
* User management
* Analytics overview
* Responsive sidebar
* Modern charts
* Dark/light mode

Design should resemble premium SaaS dashboards.

---

# Frontend Pages

## Public Pages

* Почетна
* Вести
* Детали за Вест
* Категории
* Пребарување
* Контакт
* Најава
* Регистрација

---

## Admin Pages

* Контролна Табла
* Управување со Вести
* Додај Вест
* Измени Вест
* Управување со Категории
* Коментари
* Корисници
* Аналитика

---

# UI Components

Create reusable components:

* Navbar
* Sidebar
* Footer
* Article Card
* Featured News Banner
* Search Bar
* Pagination
* Comment Section
* Buttons
* Inputs
* Modals
* Toast Notifications
* Skeleton Loaders

---

# State Management

Use Context API for:

* Authentication
* Global news state
* Notifications
* Theme mode
* Favorites

---

# File Uploads

Implement article image uploads using:

* Multer
* Local uploads folder

Requirements:

* Image validation
* File size limits
* Preview before upload

---

# Search Functionality

Implement:

* Live search
* Search by title
* Search by category
* Search suggestions

---

# Security Requirements

Implement:

* Password hashing
* JWT protection
* Input validation
* SQL injection prevention
* Secure middleware
* Error handling
* Rate limiting structure

---

# Animations & UX

Use modern subtle animations:

* Fade effects
* Hover transitions
* Smooth page transitions
* Card animations
* Skeleton loading

---

# Accessibility

Ensure:

* Semantic HTML
* Keyboard accessibility
* Proper contrast
* Responsive font sizing
* Accessible forms

---

# Performance Optimization

Optimize:

* Lazy loading
* API structure
* Component reusability
* Database queries
* Image optimization

---

# Future Scalability

Prepare architecture for future:

* Cloud deployment
* REST API expansion
* Mobile application integration
* Notification system
* Email verification
* AI-powered recommendations

---

# Final Goal

Build a production-ready modern healthcare news platform for North Macedonia that includes:

* Modern premium UI/UX
* Full backend system
* PostgreSQL database
* Secure authentication
* Scalable architecture
* Professional healthcare branding
* Fully Macedonian localization

The final application should feel like a real-world professional healthcare media platform ready for deployment in production.
