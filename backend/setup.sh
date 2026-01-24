#!/bin/bash

echo "===================================="
echo "EcoCash Backend Setup"
echo "===================================="
echo ""

echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Running migrations..."
python manage.py migrate

echo ""
echo "===================================="
echo "Creating superuser..."
echo "===================================="
python manage.py createsuperuser

echo ""
echo "===================================="
echo "Setup complete!"
echo "===================================="
echo ""
echo "To start the server, run:"
echo "  python manage.py runserver"
echo ""
echo "Admin panel will be available at:"
echo "  http://localhost:8000/admin/"
echo ""





















