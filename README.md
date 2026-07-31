# Company Directory Cloud Computing Project

## Abstract
This project presents a cloud-ready Company Directory Management System that allows administrators to manage company records securely through a responsive web dashboard. The system uses Node.js, Express.js, MongoDB Atlas, HTML, CSS, and JavaScript to provide CRUD operations, authentication, search, filtering, analytics, and deployment-ready APIs.

## Introduction
Modern organizations need a fast and reliable way to manage company details, employee counts, locations, and industry information. This project addresses that need by providing a simple but professional web application for maintaining a directory of companies in a cloud environment.

## Existing System
Traditional company directories are often maintained manually using spreadsheets, paper records, or disconnected tools. These systems are difficult to search, update, and share, and they do not provide centralized analytics or security.

## Proposed System
The proposed system provides a centralized web-based directory with admin login, JWT authentication, CRUD operations, search and filter features, dashboard statistics, and cloud database connectivity through MongoDB Atlas.

## Architecture
Client -> Frontend (HTML/CSS/JavaScript) -> REST API (Express.js) -> MongoDB Atlas

## Modules
- Authentication Module
- Company Management Module
- Search and Filter Module
- Dashboard Statistics Module

## Database Design
The system stores company information in a MongoDB collection named companies with the following fields:
- companyName
- location
- industry
- employeeCount
- email
- website
- contactNumber
- createdAt
- updatedAt

## Implementation
The frontend uses fetch-based API calls to communicate with the backend. The backend uses Express and Mongoose to validate requests, manage authentication, and store/retrieve records from MongoDB Atlas. A fallback demo mode also allows the application to run locally even if the Atlas URI is not yet configured.

## Testing
The application was tested for admin login, company creation, editing, deletion, search, filtering, validation, and dashboard statistics through browser interactions and API requests.

## Advantages
- Easy to use for beginners
- Secure admin login with JWT
- Cloud-ready and scalable architecture
- Responsive UI for desktop and mobile
- Useful for final-year academic submission

## Future Scope
- Add role-based access control
- Add charts and reports
- Add Excel/PDF export
- Add image or document upload support

## Conclusion
The Company Directory Cloud Computing Project demonstrates a complete full-stack solution for managing company records efficiently in a cloud environment and is suitable for academic submission and future deployment.

## Features
- Admin login with JWT authentication
- Add, update, view, and delete company records
- Search companies by name
- Filter by industry
- Responsive dashboard UI with analytics cards
- MongoDB Atlas cloud database support
- REST API backend with Express.js

## Project Structure
```
CC Project/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── controllers/
│   │   ├── authController.js
│   │   └── companyController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   └── Company.js
│   └── routes/
│       ├── authRoutes.js
│       └── companyRoutes.js
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Installation Steps
1. Open the project folder in VS Code.
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Configure the backend environment file:
   - Open backend/.env
   - Set MONGO_URI to your Atlas connection string
   - Set JWT_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD
4. Start the backend server:
   ```bash
   npm run dev
   ```
5. Open frontend/index.html in the browser.

## MongoDB Atlas Setup
1. Create a free Atlas cluster.
2. Add a database user.
3. Allow network access.
4. Copy the connection string into backend/.env.

## Running the Application
- Backend:
  ```bash
  cd backend
  npm run dev
  ```
- Frontend:
  - Open frontend/index.html directly in the browser, or
  - Use Live Server for better experience.

## Admin Login
- Default login credentials:
  ```env
  ADMIN_EMAIL=admin@companycloud.com
  ADMIN_PASSWORD=SecurePass123
  ```

## Deployment Instructions
### Render
1. Push the project to GitHub.
2. Create a new Web Service on Render.
3. Set the build command to npm install.
4. Set the start command to npm start.
5. Add the environment variables for MONGO_URI, JWT_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD.

### AWS EC2
1. Launch an Ubuntu EC2 instance.
2. Install Node.js and npm.
3. Upload the project files.
4. Run npm install.
5. Start the server with npm start.

## GitHub Upload Commands
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Postman Testing Steps
1. Open Postman.
2. Send a POST request to http://localhost:5000/api/auth/login with the JSON body:
   ```json
   {
     "email": "admin@companycloud.com",
     "password": "SecurePass123"
   }
   ```
3. Copy the returned token.
4. Set the Authorization header to Bearer <token> for company requests.
5. Test GET, POST, PUT, DELETE requests for /api/companies.

## Viva Questions and Answers
### Q1. What is this project about?
A. It is a cloud-based company directory system used to manage company records securely.

### Q2. Which technologies are used?
A. Node.js, Express.js, MongoDB Atlas, HTML, CSS, and JavaScript.

### Q3. What is JWT?
A. JWT is a token-based authentication method used to secure API access.

### Q4. Why use MongoDB Atlas?
A. It provides a cloud-hosted database solution that is scalable and easy to manage.

### Q5. What are the main modules?
A. Authentication, company management, search/filter, and analytics.
