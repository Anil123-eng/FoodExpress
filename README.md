# 🍔 FoodExpress

**A full-stack food delivery web application built with React, Django REST Framework, and MySQL.**

FoodExpress is a portfolio project that allows users to browse food items, search and filter the menu, manage their cart, place orders, and view their order history through a responsive web interface.

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Logout functionality

### 🍽️ Menu
- Browse food items with images and prices
- Search menu items
- Filter items by category
- Sort menu items
- View food details
- Add items to cart
- Order directly from the menu

### 🛒 Cart
- Add food items to cart
- Increase or decrease quantities
- Remove items from cart
- Calculate cart total

### 📦 Orders
- Checkout and place orders
- View order history
- View order details
- Navigate from order items back to the menu

### 📱 Responsive UI
- Responsive desktop and mobile layouts
- Desktop navigation
- Mobile bottom navigation
- Interactive menu cards
- Selected menu item highlighting

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| Routing | React Router |
| Styling | CSS |
| Backend | Python, Django |
| API | Django REST Framework |
| Authentication | Simple JWT |
| Database | MySQL |
| Tools | Git, GitHub, VS Code, Postman, MySQL Workbench |

---

## 📁 Project Structure

```text
FoodExpress/
│
├── Backend/
│   ├── accounts/
│   ├── cart/
│   ├── config/
│   ├── menu/
│   ├── orders/
│   ├── users/
│   ├── media/
│   │   └── menu/
│   ├── .env.example
│   ├── manage.py
│   └── requirements.txt
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation and Setup

### Prerequisites

Install the following before running the project:

- Python
- Node.js and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Anil123-eng/FoodExpress.git
```

Navigate to the project directory:

```bash
cd FoodExpress
```

### 2. Backend Setup

Navigate to the Backend directory:

```bash
cd Backend
```

Create a virtual environment:

```bash
python -m venv env
```

Activate the virtual environment on Windows:

```powershell
.\env\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file inside the `Backend` directory.

Copy the contents from `.env.example` and configure your environment variables:

```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=foodexpress
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
```

**Important:** Never commit your `.env` file or expose secret keys and database credentials.

### 4. Database Setup

Open MySQL Workbench or your MySQL command line and create the database:

```sql
CREATE DATABASE foodexpress;
```

Configure your MySQL credentials in the `.env` file.

Run the database migrations:

```bash
python manage.py migrate
```

### 5. Start the Backend Server

From the Backend directory:

```bash
python manage.py runserver
```

Backend URL:

```text
http://127.0.0.1:8000/
```

### 6. Frontend Setup

Open a new terminal and navigate to the Frontend directory from the project root:

```bash
cd FoodExpress/Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173/
```

---

## 🔗 API

The backend provides REST API endpoints for:

- Authentication
- Menu items
- Cart management
- Order management
- User management

The API is built using Django REST Framework and uses JWT authentication for protected endpoints.

---

## 📸 Screenshots

Screenshots of the application will be added here.

---

## 🔮 Future Improvements

- Payment integration
- Restaurant owner dashboard
- Menu management
- Automated testing
- Cloud deployment

---

## 👨‍💻 Author

**M. Anil**

B.Tech Computer Science and Engineering graduate

GitHub: [Anil123-eng](https://github.com/Anil123-eng)

---

## 📄 License

This project was developed for educational and portfolio purposes.
