# ELECTRONICS STORE

This is a basic application that can be used by a retailer of electronics items like Fridge, AC, Washing Machine and so on that helps to maintain stock by adding, deleting, and updating the items along with keeping record of sales to track profit and loss.



## Features

- **Stock Management**: Add, delete, and update electronic items in the inventory.
- **Sales Tracking**: Record sales transactions and monitor stock levels.
- **Profit/Loss Reports**: Tracks profit/loss of any day.
- **Automatic Stock Adjustment**: When a bill is created/deleted, the stock is automatically updated to reflect the quantity changed.
- **View Bill Contents**: Click on a bill to see its detailed contents.

## Technologies Used

- **MongoDB**: Database for storing stock items and sales.
- **Express.js**: Backend framework for building RESTful APIs.
- **React**: Frontend library for creating the user interface.
- **Node.js**: JavaScript runtime for server-side development.
- **Bootstrap**: CSS framework for responsive design.
- **SweetAlert**: Beautiful alert messages for user feedback.
- **Cors**: A middleware that enables Cross-Origin Resource Sharing, allowing your frontend to communicate with your backend API securely.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bhoomi1309/electronics-store.git
2. **Navigate to the project directory**:
   ```bash
   cd electronics-store
3. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
4. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
5. **Environment Variables**:
   
   Create a `.env` file in the **backend** directory and add the following environment variables for your application. The user here is a read-only database user:-  
   ```bash
   USER="demo_user"
   PASSWORD="random"
   PORTSTOCK=3001
   PORTSALES=3002
6. **Run backend server for Stock database**:
   ```bash
   cd backend
   node scriptStock.js
7. **Run backend server for Sales database**:
   ```bash
   cd backend
   node scriptBills.js
8. **Run the frontend development server**:
   ```bash
   cd frontend
   npm start

## Usage

Visit http://localhost:3000 in your browser to access the application. Users can log in, manage stock items, record sales, and track profit and loss.

## API Endpoints

**Base URL**
```bash
http://localhost:3000
```

#### Stock Management Endpoints

- **GET `/stock`** — **{fetchElectronicsData}**
  - **Description**: Retrieves a list of all electronics items in stock.

- **POST `/modifyStock`** — **{addElectronics}**
  - **Description**: Adds a new item to the stock.

- **PUT `/modifyStock/:id`** — **{editElectronics}**
  - **Description**: Updates the details of an existing item (like name, price).

- **PUT `/modifyStock/:id`** — **{updateElectronicsStock}**
  - **Description**: Updates the stock quantity of an item when a bill is made or deleted.

- **DELETE `/stock/:id`** — **{deleteElectronics}**
  - **Description**: Deletes an item from the stock.

- **POST `/stock/:id`** — **{renumberElectronics}**
  - **Description**: Renumbers the IDs of all items after an item is deleted from the stock.

#### Sales Management Endpoints

- **GET `/sales`** — **{fetchBillData}**
  - **Description**: Retrieves a list of all bills.

- **GET `/sales/:id`** — **{getBillById}**
  - **Description**: Retrieves the details of a specific bill.

- **POST `/sales/bill`** — **{addBill}**
  - **Description**: Records a new bill.

- **DELETE `/sales/:id`** — **{deleteBill}**
  - **Description**: Deletes a bill from sales.

- **POST `/sales/:id`** — **{renumberBills}**
  - **Description**: Renumbers the IDs of all bills after a bill is deleted from sales.

