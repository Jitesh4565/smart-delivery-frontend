# 🖥️ Smart Delivery Management - Frontend

This is the frontend of the Smart Delivery Management System, built with **React + TypeScript** and styled using **Material UI**.

It provides an admin dashboard to:

* View and manage delivery partners
* Track orders
* Run smart auto-assignment of orders to partners

---

## ⚙️ Tech Stack

* React + TypeScript
* React Router
* Material UI (v5)
* Axios for API calls

---

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/smart-delivery-frontend.git
cd smart-delivery-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file in root

```
VITE_API_URL=https://your-backend-url/api
```

### 4. Run the development server

```bash
npm run dev
```

The app will run at `http://localhost:5173`

---

## 📁 Pages

* `/` – Dashboard with key stats and assignment trigger
* `/partners` – Add/edit/delete delivery partners
* `/orders` – View all orders with filters
* `/assignments` – Run assignment and view metrics

---

## ✅ Features Covered

* Partner registration and list
* Profile editing + shift and area management
* Order creation and filtering
* Run smart assignment logic from frontend
* Responsive UI with Material UI

---

## 📦 API

All API requests use the base URL from the `.env` file and are managed in `src/api/axios.ts`

Example:

```ts
axios.get("/partners"); // Hits: https://your-backend-url/api/partners
```

---

