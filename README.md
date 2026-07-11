# Stockflow - Inventory Management System

Stockflow is a modern, full-stack Inventory Management System (IMS) designed to streamline supply chain operations. It provides an intuitive dashboard to manage products, track orders, handle purchase orders (POs), and oversee suppliers and warehouses.

## 🚀 Features

*   **Secure Authentication:** User login and signup functionality.
*   **Centralized Dashboard:** A high-level overview of inventory metrics and activities.
*   **Product Management:** Full CRUD operations for inventory items (add, update, view, delete).
*   **Order Tracking:** Seamlessly manage customer orders and fulfillment status.
*   **Supplier & PO Management:** Maintain supplier records and generate/track Purchase Orders.
*   **Warehouse Administration:** Organize and monitor stock across different warehouse locations.
*   **Receiving Operations:** Dedicated module for receiving incoming shipments and updating stock levels.
*   **Responsive UI:** Built with Tailwind CSS for a seamless experience across devices.

## 🛠 Tech Stack

**Frontend**
*   [React](https://reactjs.org/) - UI Library
*   [Vite](https://vitejs.dev/) - Build Tool & Development Server
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

**Backend**
*   [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - RESTful API framework
*   **Database:** SQL-based relational database (accessed via custom `db.js` configuration)

## 📂 Project Structure

```text
ims-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection setup
│   ├── controllers/              # Request handling logic
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── poController.js
│   │   ├── productController.js
│   │   ├── supplierController.js
│   │   └── warehouseController.js
│   ├── routes/                   # API route definitions
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── poRoutes.js
│   │   ├── productRoutes.js
│   │   ├── supplierRoutes.js
│   │   └── warehouseRoutes.js
│   ├── .env                      # Backend environment variables
│   ├── package.json
│   └── server.js                 # Main Express server entry point
├── src/                          # Frontend React source code
│   ├── components/               # Reusable UI & Page components
│   │   ├── DashboardHome.jsx
│   │   ├── DashboardLayout.jsx
│   │   ├── Features.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Login.jsx
│   │   ├── Navbar.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ReceivingPage.jsx
│   │   ├── Signup.jsx
│   │   ├── SuppliersPage.jsx
│   │   ├── TrustBadges.jsx
│   │   └── WarehousesPage.jsx
│   ├── App.jsx                   # Root React component
│   ├── index.css                 # Global styles & Tailwind imports
│   └── main.jsx                  # React DOM rendering entry point
├── .gitignore
├── index.html                    # Frontend HTML template
├── package.json                  # Frontend dependencies
├── postcss.config.js             # PostCSS configuration for Tailwind
├── tailwind.config.js            # Tailwind CSS configuration
└── vite.config.js                # Vite configuration
