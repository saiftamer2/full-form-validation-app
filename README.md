# Full Stack Form Validation App



The project demonstrates a multi-field form connected to an Express.js backend with client-side and server-side validation, image upload, loading states, and success/error messages.

## Features

- Multi-field application form
- Client-side validation
- Server-side validation
- Field-specific validation error messages
- Gender dropdown
- Date of birth field
- Profile image upload
- JPG and PNG image validation
- 5 MB image size limit
- Success and error messages
- Loading indicator during submission
- Submit button disabled while submitting
- Express.js backend API

## Form Fields

The form contains 7 fields:

1. Full Name
2. Email
3. Phone Number
4. Job Title
5. Gender
6. Date of Birth
7. Profile Image

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express.js
- Multer
- CORS

## Validation

### Client-side validation

The frontend validates:

- Required fields
- Minimum name length
- Email format
- Phone number format
- Gender selection
- Date of birth
- Image type
- Image size

### Server-side validation

The backend performs matching validation before accepting the application.

The server also validates uploaded images and limits their size to 5 MB.

## API

### Submit Application

```http
POST /api/applications

full-form-validation-app/
│
├── backend/
│   ├── uploads/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md