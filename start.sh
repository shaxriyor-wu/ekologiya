#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR"
PID_DIR="$SCRIPT_DIR/.pids"

# Create PID directory
mkdir -p "$PID_DIR"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if port is in use
port_in_use() {
    lsof -i :"$1" >/dev/null 2>&1 || netstat -an 2>/dev/null | grep -q ":$1 " || ss -lnt 2>/dev/null | grep -q ":$1 "
}

# Function to stop servers
stop_servers() {
    print_info "Serverni to'xtatish..."
    
    if [ -f "$PID_DIR/backend.pid" ]; then
        BACKEND_PID=$(cat "$PID_DIR/backend.pid")
        if kill -0 "$BACKEND_PID" 2>/dev/null; then
            kill "$BACKEND_PID" 2>/dev/null
            print_success "Backend server to'xtatildi (PID: $BACKEND_PID)"
        fi
        rm -f "$PID_DIR/backend.pid"
    fi
    
    if [ -f "$PID_DIR/frontend.pid" ]; then
        FRONTEND_PID=$(cat "$PID_DIR/frontend.pid")
        if kill -0 "$FRONTEND_PID" 2>/dev/null; then
            kill "$FRONTEND_PID" 2>/dev/null
            print_success "Frontend server to'xtatildi (PID: $FRONTEND_PID)"
        fi
        rm -f "$PID_DIR/frontend.pid"
    fi
    
    # Kill any remaining processes
    pkill -f "manage.py runserver" 2>/dev/null
    pkill -f "vite" 2>/dev/null
    
    print_success "Barcha serverlar to'xtatildi"
    exit 0
}

# Trap Ctrl+C
trap stop_servers INT TERM

echo "===================================="
echo "EcoCash - Backend va Frontend Ishga Tushirish"
echo "===================================="
echo ""

# Check dependencies
print_info "Dependencies tekshirilmoqda..."

if ! command_exists python3 && ! command_exists python; then
    print_error "Python topilmadi! Iltimos, Python o'rnating."
    exit 1
fi

# Use python3 if available, otherwise python
if command_exists python3; then
    PYTHON_CMD="python3"
else
    PYTHON_CMD="python"
fi

if ! command_exists node; then
    print_error "Node.js topilmadi! Iltimos, Node.js o'rnating."
    exit 1
fi

if ! command_exists npm; then
    print_error "npm topilmadi! Iltimos, npm o'rnating."
    exit 1
fi

print_success "Barcha dependencies mavjud"

# Check Python version
PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | awk '{print $2}')
print_info "Python versiyasi: $PYTHON_VERSION"

# Check Node version
NODE_VERSION=$(node --version)
print_info "Node.js versiyasi: $NODE_VERSION"

# Check if ports are available
print_info "Portlar tekshirilmoqda..."

if port_in_use 8000; then
    print_warning "Port 8000 band! Backend server allaqachon ishlayotgan bo'lishi mumkin."
    read -p "Davom etishni xohlaysizmi? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

if port_in_use 3000; then
    print_warning "Port 3000 band! Frontend server allaqachon ishlayotgan bo'lishi mumkin."
    read -p "Davom etishni xohlaysizmi? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check backend setup
print_info "Backend sozlamalari tekshirilmoqda..."

if [ ! -d "$BACKEND_DIR" ]; then
    print_error "Backend papkasi topilmadi: $BACKEND_DIR"
    exit 1
fi

cd "$BACKEND_DIR" || exit 1

# Check if virtual environment exists
if [ -d "venv" ]; then
    print_info "Virtual environment topildi, aktiv qilinmoqda..."
    source venv/bin/activate
elif [ -d ".venv" ]; then
    print_info "Virtual environment topildi (.venv), aktiv qilinmoqda..."
    source .venv/bin/activate
else
    print_warning "Virtual environment topilmadi. Global Python ishlatilmoqda."
fi

# Check if Django is installed
if ! $PYTHON_CMD -c "import django" 2>/dev/null; then
    print_warning "Django topilmadi. O'rnatilmoqda..."
    pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        print_error "Dependencies o'rnatishda xatolik!"
        exit 1
    fi
    print_success "Dependencies o'rnatildi"
fi

# Run migrations
print_info "Migratsiyalar tekshirilmoqda..."
$PYTHON_CMD manage.py migrate --noinput
if [ $? -ne 0 ]; then
    print_error "Migratsiyalarda xatolik!"
    exit 1
fi
print_success "Migratsiyalar bajarildi"

# Check frontend setup
print_info "Frontend sozlamalari tekshirilmoqda..."

cd "$FRONTEND_DIR" || exit 1

if [ ! -d "node_modules" ]; then
    print_warning "node_modules topilmadi. O'rnatilmoqda..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "npm install xatolik bilan tugadi!"
        exit 1
    fi
    print_success "Frontend dependencies o'rnatildi"
fi

# Fix permissions for node_modules/.bin executables
if [ -d "node_modules/.bin" ]; then
    chmod +x node_modules/.bin/* 2>/dev/null
fi

# Start backend server
print_info "Backend serverni ishga tushirish..."
cd "$BACKEND_DIR" || exit 1

# Activate venv if exists
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
fi

# Start backend in background
nohup $PYTHON_CMD manage.py runserver 0.0.0.0:8000 > "$PID_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > "$PID_DIR/backend.pid"

# Wait a bit for backend to start
sleep 2

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    print_error "Backend server ishga tushmadi! Loglarni tekshiring: $PID_DIR/backend.log"
    cat "$PID_DIR/backend.log"
    exit 1
fi

print_success "Backend server ishga tushdi (PID: $BACKEND_PID)"
print_info "Backend log: $PID_DIR/backend.log"

# Start frontend server
print_info "Frontend serverni ishga tushirish..."
cd "$FRONTEND_DIR" || exit 1

# Start frontend in background
nohup npm run dev > "$PID_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > "$PID_DIR/frontend.pid"

# Wait a bit for frontend to start
sleep 3

# Check if frontend started successfully
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    print_error "Frontend server ishga tushmadi! Loglarni tekshiring: $PID_DIR/frontend.log"
    cat "$PID_DIR/frontend.log"
    stop_servers
    exit 1
fi

print_success "Frontend server ishga tushdi (PID: $FRONTEND_PID)"
print_info "Frontend log: $PID_DIR/frontend.log"

echo ""
echo "===================================="
print_success "Servernar muvaffaqiyatli ishga tushirildi!"
echo "===================================="
echo ""
echo -e "${GREEN}Backend:${NC}     http://127.0.0.1:8000"
echo -e "${GREEN}Frontend:${NC}    http://localhost:3000"
echo -e "${GREEN}Admin Panel:${NC} http://127.0.0.1:8000/admin/"
echo ""
echo -e "${YELLOW}Serverlar background'da ishlamoqda.${NC}"
echo -e "${YELLOW}Loglarni ko'rish:${NC}"
echo "  Backend:  tail -f $PID_DIR/backend.log"
echo "  Frontend: tail -f $PID_DIR/frontend.log"
echo ""
echo -e "${YELLOW}Serverni to'xtatish uchun:${NC}"
echo "  ./stop.sh yoki Ctrl+C"
echo ""
echo -e "${BLUE}Serverlar ishlamoqda. To'xtatish uchun Ctrl+C bosing...${NC}"

# Wait for user interrupt
wait
