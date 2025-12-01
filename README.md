# PlanRetreat

PlanRetreat is a modern web application designed to help companies and groups find and book the perfect venue for their retreats. It features a responsive user interface for browsing venues and a robust API for managing bookings, all built with a **Three-Tier Architecture**.

## 🏗️ Architecture

The application follows a classic Three-Tier Architecture, ensuring separation of concerns, scalability, and maintainability.

1.  **Presentation Tier (Frontend)**:
    *   Built with **Next.js 14** (App Router) and **Tailwind CSS**.
    *   Handles user interactions, venue browsing, and booking forms.
    *   Communicates with the Logic Tier via REST API.

2.  **Logic Tier (Backend)**:
    *   Built with **Node.js** and **Express.js**.
    *   Processes business logic, validates requests (Zod), and manages data flow.
    *   Exposes a RESTful API documented with **Swagger/OpenAPI**.

3.  **Data Tier (Database)**:
    *   **PostgreSQL** database for persistent storage.
    *   Managed via **Prisma ORM** for type-safe database access and migrations.

## 🚀 Features

-   **Venue Discovery**: Browse a curated list of retreat venues with details like capacity, price, and location.
-   **Smart Booking System**:
    -   Check venue availability in real-time.
    -   Prevent double bookings with overlapping date validation.
    -   Interactive date picker with booked dates disabled.
-   **Responsive Design**: A beautiful, mobile-friendly UI built with Tailwind CSS.
-   **Containerized Deployment**: Fully dockerized environment for consistent development and production workflows.

## 🛠 Tech Stack

### **UI Service (Frontend)**
-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Components**: React DatePicker, Lucide Icons
-   **Testing**: Jest, React Testing Library

### **API Service (Backend)**
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Validation**: Zod
-   **Testing**: Jest, Supertest

### **Infrastructure**
-   **Containerization**: Docker, Docker Compose
-   **Orchestration**: Shell scripts for automated workflows

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
-   [Docker](https://www.docker.com/get-started) & Docker Compose
-   [Node.js](https://nodejs.org/) (v18+ recommended for local development outside Docker)

---

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Swannhs/planretreat_assignment.git
cd planretreat_assignment
```

### 2. Running in Development Mode

The development environment sets up the database and runs the services with hot-reloading enabled.

```bash
./run.sh
```

-   **UI**: [http://localhost:3000](http://localhost:3000)
-   **API**: [http://localhost:4000](http://localhost:4000)
-   **Database**: PostgreSQL on port `5432`

### 3. Running in Production Mode

The production script builds optimized Docker images, runs tests, applies migrations, and seeds the database before starting the services.

```bash
./run-prod.sh
```

-   **UI**: [http://localhost:3000](http://localhost:3000)
-   **API**: [http://localhost:4000](http://localhost:4000)

> **Note**: The production build includes a testing stage. If tests fail, the build will stop, ensuring only stable code is deployed.

---

## 🧪 Running Tests

You can run tests for each service individually or as part of the Docker build process.

### **API Service Tests**
```bash
cd api-service
npm test
```

### **UI Service Tests**
```bash
cd ui-service
npm test
```

---

## 📂 Project Structure

```
planretreat/
├── api-service/            # Backend Express application
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Database access layer
│   │   ├── routes/         # API route definitions
│   │   └── tests/          # Unit and integration tests
│   └── Dockerfile          # Dev Dockerfile
│   └── Dockerfile.prod     # Prod Dockerfile
│
├── ui-service/             # Frontend Next.js application
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Reusable UI components
│   │   └── lib/            # Utility functions
│   └── Dockerfile          # Dev Dockerfile
│   └── Dockerfile.prod     # Prod Dockerfile
│
├── docker-compose.yml      # Development composition
├── docker-compose.prod.yml # Production composition
├── run.sh                  # Development startup script
└── run-prod.sh             # Production startup script
```

## 🔌 API Endpoints & Documentation

The API is fully documented using **Swagger/OpenAPI**. You can explore the endpoints, test requests, and view schemas interactively.

-   **Local Swagger UI**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)
-   **Live Swagger UI**: [https://api-service-two-pi.vercel.app/api-docs](https://api-service-two-pi.vercel.app/api-docs)

### **Venues**
-   `GET /api/venues`: List all venues (supports pagination).
-   `GET /api/venues/:id`: Get details of a specific venue.

### **Bookings**
-   `POST /api/bookings`: Create a new booking.
    -   **Body**: `{ venueId, companyName, email, startDate, endDate, attendeeCount }`
-   `GET /api/bookings?venueId=:id`: Get all bookings for a specific venue (used for availability checking).

---

## 🌐 Live Demo

Check out the live application deployed on Vercel:

-   **Frontend Application**: [https://ui-service-ten.vercel.app/](https://ui-service-ten.vercel.app/)
-   **Backend API Docs**: [https://api-service-two-pi.vercel.app/api-docs](https://api-service-two-pi.vercel.app/api-docs)

---

## 🐳 Docker Workflow

-   **Development**: Uses `docker-compose.yml`. Mounts source code as volumes for live updates.
-   **Production**: Uses `docker-compose.prod.yml`. Builds multi-stage images:
    1.  **Builder**: Installs dependencies, runs tests, builds the app.
    2.  **Runner**: Minimal image with only production artifacts.

## 🛡️ Error Handling & Validation

-   **Backend**: Uses `Zod` for strict request validation. Global error handlers ensure consistent JSON error responses.
-   **Frontend**: Displays user-friendly error messages for validation failures (e.g., invalid dates, capacity exceeded) and API errors.
