# EcoCash Backend - Django

Django backend for EcoCash recycling application with admin panel.

## Installation

1. Create and activate virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create superuser (admin):
```bash
python manage.py createsuperuser
```

5. Run development server:
```bash
python manage.py runserver
```

## Admin Panel

After creating superuser, access admin panel at:
- URL: http://localhost:8000/admin/
- Login with superuser credentials

## API Endpoints

- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user
- `GET /api/users/me/` - Get current user (authenticated)
- `POST /api/users/logout/` - Logout user
- `POST /api/users/{id}/update_stats/` - Update user stats
- `POST /api/users/{id}/add_card/` - Add credit card
- `POST /api/users/{id}/pay_utility/` - Pay utility bill
- `GET /api/transactions/` - Get user transactions
- `GET /api/stats/` - Get global statistics

## Models

- **User**: Custom user model with balance, level, recycled kg
- **Transaction**: User transactions (earn/spend)
- **CreditCard**: User credit cards
- **GlobalStats**: Global statistics





















