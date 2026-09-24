E-Commerce Website
A simple, full-featured e-commerce web application built with Node.js, Express, EJS and MySQL. It includes product management, shopping cart, checkout, user authentication, order management, and an admin dashboard.

# E-Commerce Website

A server-rendered e-commerce application built with Node.js, Express, EJS,
Sequelize, and MySQL. The application provides product browsing, authentication,
shopping cart and checkout flows, order history, and an admin dashboard.

## Features

- User registration and login
- Product and category management for administrators
- Shopping cart and checkout
- Order history and order details
- Product image uploads in `public/uploads/products`
- Admin management for products, categories, inventory, and orders
- Automatic database schema synchronization and starter data on startup

## Tech Stack

- Node.js and Express
- EJS templates
- MySQL with Sequelize
- Bootstrap 5
- Multer for image uploads

## Prerequisites

- Node.js 18 or newer
- MySQL running locally or on a reachable server
- A MySQL database created for the application

## Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone <repo-url>
   cd E_Commerce
   npm install
   ```

2. Create a `.env` file in the project root:

   ```dotenv
   PORT=3000
   SESSION_SECRET=replace-with-a-long-random-value
   DB_NAME=warehouses_db
   DB_USER=root
   DB_PASS=root
   DB_HOST=127.0.0.1
   DB_DIALECT=mysql
   DB_PORT=3307
   ```

   Change the database values to match your MySQL installation. The application
   reads these variables from `.env` when it starts.

3. Start the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000), or the URL using the
   port configured in `PORT`.

On startup, the application synchronizes the Sequelize models and creates the
default accounts and starter products/categories when they do not already exist.
You do not need to run Sequelize CLI migrations or seeders for the normal local
setup.

## Default Accounts

The startup seeder creates these accounts if they do not exist:

| Role  | Email               | Password   |
| ----- | ------------------- | ---------- |
| Admin | `admin@example.com` | `admin123` |
| User  | `user@example.com`  | `user123`  |

Change or remove these credentials before deploying outside a local development
environment.

## Project Structure

```text
app.js                 Application entry point
config/                Database configuration
controllers/           Request handlers
models/                Sequelize models
routes/                Express route definitions
seeders/               Startup seed data
views/                 EJS templates
public/                Static assets and uploaded product images
```

## Available Commands

```bash
npm run dev             Start the server with Nodemon
```

The project currently does not define an `npm start` script.
