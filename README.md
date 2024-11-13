# To-Do List Application

This is a simple To-Do List application built with **React** for the frontend and **Node.js** with **Express** for the backend. The application allows users to manage tasks, including adding, editing, deleting, and marking tasks as complete. The backend stores tasks in a **SQLite** database, and **JWT authentication** is implemented for secure user logins and task management.

## Features

- **User Authentication**: Users can sign up and log in using JWT-based authentication.
- **Task Management**: Users can add, edit, delete, and mark tasks as completed.
- **Task Filtering**: Users can filter tasks based on their status (e.g., completed or pending).
- **Responsive UI**: The app is designed to work on both desktop and mobile devices.
- **Protected Routes**: Only authenticated users can access and manage their tasks.

- **Authentication**:
  - Secure JWT-based login for both consumers and admins.
  
- **Error Handling**:
  - Clear error messages for failed actions or API calls.

## Technologies Used

- **Frontend**: React.js, Axios, React Router
- **Backend**: Node.js, Express, JWT for authentication, SQLite for data storage

## Installation

To set up the app locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/upenderdeshaboina/oscowl-todol-list-application.git  

```

### 2.Install Dependencies
Navigate to the project directories and install dependencies for both backend and frontend.

#### Backend

```bash
cd backend
npm install
```
#### Frontend
```bash
cd todo-list-application
npm install
```
### 3. Set Up Environment Variables Backend
Create a .env file in the backend directory and add the following variables:
```env
PORT=3005
MY_SECRET_CODE='my_secret_key'
```
### 4.Start the Development Server
To start the servers:
#### Backend
```bash
cd backend
node index.js
```
#### Frontend
```bash
cd todo-list-application
npm start
```
The frontend will run on http://localhost:3000, and the backend will run on http://localhost:3005.

### Usage
- Login: user can Login.  
- Register: user can register.  
- CRUD todos: Todos can create, update, read and delete.
- CRUD user: users can register, login, details,delete their account.

## Deployment
The app can be deployed using:

**Full stack**: Netlify and Vercel.  
**Backend**: render.

## Contact
For questions or feedback, feel free to reach out at [upenderdeshaboina12@gmail.com](mailto:upenderdeshaboina12@gmail.com).