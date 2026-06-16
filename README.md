# Vernissage

A minimal full-stack web application skeleton with a .NET 10 backend API and a React + TypeScript frontend.

## Project Structure

```
/backend
  /Vernissage.Api     – ASP.NET Core Web API (.NET 10)
  Vernissage.sln

/frontend
  /vernissage.web     – React + TypeScript + Vite
```

## Running Locally

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) and npm

### 1. Start the Backend

```bash
cd backend/Vernissage.Api
dotnet run
```

The API will be available at `http://localhost:5000`.  
OpenAPI spec (development only): `http://localhost:5000/openapi/v1.json`

### 2. Start the Frontend

```bash
cd frontend/vernissage.web
npm install   # only needed the first time
npm run dev
```

The app will be available at `http://localhost:5173`.

### 3. Use the App

1. Open `http://localhost:5173` in your browser.
2. Click **Call API**.
3. The response from the .NET backend will be displayed on the page.
