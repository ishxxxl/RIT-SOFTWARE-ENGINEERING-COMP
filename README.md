# RIT-SOFTWARE-ENGINEERING-COMPETITION

# NeedsConnect

NeedsConnect is a web platform designed to connect people in need with helpers who wish to contribute. Helpers can browse community requests, make donations, and track funding progress, while requesters can submit new needs for approval.

## Features

- Browse and sort needs by category, urgency, or funding amount.
- View detailed need information and deadlines.
- Donate using preset or custom amounts.
- Manage donations through an interactive basket system.
- Checkout updates the database and progress bars in real time.
- Request new needs through a simple form.

## Tech Stack

- Frontend: HTML, CSS, JavaScript  
- Backend: Node.js, Express.js  
- Database: MySQL  

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/NeedsConnect.git

2. Navigate to the project directory:
   ```bash
   cd NeedsConnect
   
3. Install dependencies:
   ```bash
   npm install

4. Start the server:
   ```bash
   node server.js

5. Open helper.html or request.html in your browser.

## Database Setup:

1. Create a MySQL database named needsconnect.
2. Create the necessary tables for needs and requests:
   ```sql
   CREATE TABLE needs (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     description TEXT,
     category VARCHAR(100),
     amount_needed DECIMAL(10,2),
     priority VARCHAR(50),
     deadline DATE,
     image_url VARCHAR(255)
   );

   CREATE TABLE requests (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255),
     description TEXT,
     category VARCHAR(100),
     amount_needed DECIMAL(10,2),
     status VARCHAR(50)
   );

3. Update server.js with your MySQL credentials.

## API Routes:

- GET /api/needs – Retrieve all needs
- POST /api/needs – Add a new need
- POST /api/needs/:id/donate – Donate to a specific need and update progress
- GET /api/requests – Retrieve all requests
- POST /api/requests – Submit a new request
- PUT /api/requests/:id – Approve or decline a request

## Usage:

- Helpers: Browse needs, select donation amounts, and check out through the basket.
- Requesters: Submit new needs for review and approval.
- Admin: Approve or decline requests to add them to the needs list.

## Code Comments:

All main files, including server.js and the HTML pages, contain explanatory comments above major functions and logical sections to make the flow of the code easier to understand.

## Author:

Created By Ishaal Shermin, Samiullah Iftikhar, Hussain Ali Syed
