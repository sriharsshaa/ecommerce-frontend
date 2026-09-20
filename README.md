# My E-Commerce – Frontend

A React-based frontend for an online electronics shopping application. The application allows users to browse products, register and log in, manage their shopping cart, place orders, and view their order history.

## Tech Stack
* React
* JavaScript (ES6+)
* Vite
* React Router
* HTML
* CSS
* Fetch API
* Local Storage

## Features

* User registration
* User login
* JWT-based authentication
* Product listing
* Product categories
* Product images
* Add products to cart
* Increase/decrease product quantity
* Remove products from cart
* Checkout
* Order placement
* Order history
* View items in an order
* Logout
* Responsive UI


## Application Architecture

React Frontend
      ↓
React Components / Pages
      ↓
Fetch API
      ↓
Spring Boot REST API
      ↓
MySQL Database



## Running the Frontend

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The application normally runs at:

```text
http://localhost:5173
```

Make sure the Spring Boot backend is also running at:

```text
http://localhost:8080
```

## Admin Demo Login

To test the admin features locally, use the following demo account:

```text
Email: sri@gmail.com
Password: Sri@123
```

### Admin Features

After logging in with the demo admin account, you can access:

* Admin Dashboard
* Product Management
* Add products
* Update products
* Delete products
* Manage product stock
* Order Management
* User Management
* Feedback Management
* Review Management

