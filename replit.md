# ElectroStore - Electronic Store Management System

## Overview
ElectroStore is a full-stack e-commerce platform for managing and selling electronic products. It features a modern React/Next.js frontend with a Django REST API backend.

**Project Type**: Full-stack web application  
**Frontend**: Next.js 15.5.6 (TypeScript, React)  
**Backend**: Django 5.2.8 (Python) with Django REST Framework  
**Database**: SQLite (development)  
**Last Updated**: November 25, 2025

## Recent Changes
- **2025-11-25**: Initial Replit setup
  - Configured Django backend to use SQLite instead of MySQL
  - Set up Next.js frontend to run on port 5000
  - Configured environment variables for API communication
  - Set up workflows for both backend and frontend
  - Configured deployment settings for Replit

## Project Structure

```
.
├── backend/                # Django REST API
│   ├── backend/           # Django settings and configuration
│   ├── cart/              # Shopping cart and checkout functionality
│   ├── inventory/         # Inventory management
│   ├── products/          # Product catalog
│   ├── reports/           # Sales and analytics reports
│   ├── users/             # User authentication and profiles
│   ├── manage.py          # Django management script
│   └── requirements.txt   # Python dependencies
│
└── Frontend/              # Next.js frontend
    ├── app/               # Next.js app directory (pages)
    ├── components/        # React components
    ├── hooks/             # Custom React hooks
    ├── lib/               # Utility functions
    ├── public/            # Static assets (images)
    └── package.json       # Node.js dependencies
```

## Architecture

### Backend (Django REST API)
- **Port**: 8000
- **Database**: SQLite (db.sqlite3)
- **Authentication**: JWT tokens (djangorestframework-simplejwt)
- **Features**:
  - User registration and authentication
  - Product catalog management
  - Shopping cart and checkout
  - Inventory tracking
  - Order management
  - Sales reporting

### Frontend (Next.js)
- **Port**: 5000 (configured for Replit webview)
- **Framework**: Next.js 15 with App Router
- **UI Library**: Radix UI components with Tailwind CSS
- **State Management**: Zustand
- **Features**:
  - Product browsing and filtering
  - Shopping cart
  - User authentication
  - Order tracking
  - User profile management
  - Favorites/wishlist

## Environment Variables

### Shared Environment
- `NEXT_PUBLIC_API_BASE_URL`: Backend API URL (automatically configured for Replit)

## Workflows

### Backend API
- **Command**: `cd backend && python manage.py runserver 0.0.0.0:8000`
- **Port**: 8000
- **Type**: Console output
- **Description**: Runs the Django development server

### Frontend
- **Command**: `cd Frontend && npm run dev`
- **Port**: 5000
- **Type**: Webview
- **Description**: Runs the Next.js development server

## Development

### Running Locally
Both workflows start automatically in Replit. The frontend is accessible through the webview, and it communicates with the backend API running on port 8000.

### Database Migrations
To apply database migrations:
```bash
cd backend
python manage.py migrate
```

To create new migrations:
```bash
cd backend
python manage.py makemigrations
```

### Admin Panel
Create a superuser to access the Django admin panel at `/admin`:
```bash
cd backend
python manage.py createsuperuser
```

## Deployment

The project is configured for Replit autoscale deployment:
- **Build**: Installs frontend dependencies and builds the Next.js app
- **Run**: Starts both backend and frontend servers
- **Type**: Autoscale (stateless web application)

## Dependencies

### Backend (Python)
- Django 5.2.8
- djangorestframework 3.15.2
- django-cors-headers 4.6.0
- django-filter 24.3
- djangorestframework-simplejwt 5.4.0

### Frontend (Node.js)
- Next.js 15.5.6
- React 18.2.0
- Tailwind CSS 4.1.9
- Radix UI components
- Zustand (state management)
- React Hook Form (form handling)
- Zod (validation)

## Key Features

1. **Product Management**: Browse and search electronic products by category
2. **Shopping Cart**: Add products to cart and proceed to checkout
3. **User Authentication**: Register, login, and manage user profiles
4. **Order Tracking**: View order history and track shipments
5. **Inventory Management**: Backend API for managing product stock
6. **Payment Integration**: Support for ABA PayWay and other payment methods
7. **Responsive Design**: Mobile-friendly UI built with Tailwind CSS

## API Endpoints

- `/api/users/` - User registration, login, and profile management
- `/api/products/` - Product catalog and search
- `/api/cart/` - Shopping cart operations
- `/api/inventory/` - Inventory management
- `/api/reports/` - Sales and analytics reports

## Notes

- The frontend uses environment variable `NEXT_PUBLIC_API_BASE_URL` to connect to the backend
- CORS is enabled on the backend to allow frontend communication
- The application uses SQLite for simplicity in development; consider PostgreSQL for production
- All static files (product images) are stored in the `Frontend/public` directory
