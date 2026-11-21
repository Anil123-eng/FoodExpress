\# FoodExpress 🍔



A full-stack food delivery web application built using React, Django REST Framework, and MySQL. FoodExpress allows users to browse food items, manage their cart, place orders, and track their order history.



This project was developed as a portfolio project to demonstrate full-stack web development skills.



\## Features



\### Authentication

\- User registration and login

\- JWT-based authentication

\- Logout functionality



\### Menu

\- Browse food items with images

\- Search menu items

\- Filter food items by category

\- Sort menu items

\- View food item details and prices

\- Add items to cart

\- Order food directly from the menu



\### Cart

\- Add items to cart

\- Update item quantities

\- Remove items from cart

\- View cart total



\### Orders

\- Checkout and place orders

\- View order history

\- View order details

\- Navigate from order items back to the menu



\### User Interface

\- Responsive design for desktop and mobile

\- Desktop navigation

\- Mobile bottom navigation

\- Interactive menu cards

\- Selected menu item highlighting



\## Technologies Used



\### Frontend

\- React

\- JavaScript

\- Vite

\- React Router

\- CSS



\### Backend

\- Python

\- Django

\- Django REST Framework

\- Django REST Framework Simple JWT



\### Database

\- MySQL



\### Tools

\- Git

\- GitHub

\- VS Code

\- Postman

\- MySQL Workbench



\## Project Structure



```text

FoodExpress/

├── Django/

│   ├── accounts/

│   ├── cart/

│   ├── config/

│   ├── menu/

│   ├── orders/

│   ├── users/

│   ├── media/

│   │   └── menu/

│   ├── manage.py

│   ├── requirements.txt

│   ├── .env.example

│   └── .env

├── React/

│   ├── public/

│   ├── src/

│   ├── package.json

│   └── vite.config.js

├── FoodItems/

├── .gitignore

└── README.md

```



\## Installation and Setup



\### Prerequisites



Make sure the following software is installed:



\- Python

\- Node.js and npm

\- MySQL Server

\- Git



\### 1. Clone the Repository



```bash

git clone <YOUR\_GITHUB\_REPOSITORY\_URL>

cd FoodExpress

```



\### 2. Backend Setup



Navigate to the Django directory:



```bash

cd Django

```



Create a virtual environment:



```bash

python -m venv env

```



Activate the virtual environment on Windows:



```powershell

.\\env\\Scripts\\activate

```



Install the dependencies:



```bash

pip install -r requirements.txt

```



\### 3. Environment Configuration



Create a `.env` file inside the `Django` directory.



Copy the contents from `.env.example` and update the values:



```env

DJANGO\_SECRET\_KEY=your-secret-key

DEBUG=True

ALLOWED\_HOSTS=localhost,127.0.0.1

DB\_NAME=foodexpress

DB\_USER=your-mysql-username

DB\_PASSWORD=your-mysql-password

```



\*\*Important:\*\* Never commit your `.env` file or expose secret keys and database credentials.



\### 4. Database Setup



Create a MySQL database for the application:



```sql

CREATE DATABASE foodexpress;

```



Configure your MySQL credentials in the `.env` file.



Run the Django migrations:



```bash

python manage.py migrate

```



\### 5. Start the Backend Server



From the `Django` directory, run:



```bash

python manage.py runserver

```



The backend will be available at:



```text

http://127.0.0.1:8000/

```



\### 6. Frontend Setup



Open a new terminal and navigate to the React directory:



```bash

cd React

```



Install the dependencies:



```bash

npm install

```



Start the development server:



```bash

npm run dev

```



The frontend will be available at the URL provided by Vite, usually:



```text

http://localhost:5173/

```



\## API



The backend provides REST API endpoints for authentication, menu items, cart management, and orders.



The API is built using Django REST Framework and uses JWT authentication for protected endpoints.



\## Screenshots



Screenshots of the application can be added here to showcase the user interface.



\## Future Improvements



\- Payment integration

\- Restaurant owner dashboard

\- Menu management

\- Automated testing

\- Deployment to a cloud platform



\## Author



Developed as a full-stack portfolio project.



\## License



This project is intended for educational and portfolio purposes.



