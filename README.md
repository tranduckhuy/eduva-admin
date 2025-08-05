<div align="center">
  <br />  
  <a href="https://admin.eduva.tech/">
    <img src="public/images/logo.png" alt="EDUVA Logo" width="200"/>
  </a>
  <br/>
  <strong>EDUVA - Comprehensive administrative platform for educational management</strong>
</div>

## 📋 Table of Contents

- [About Project](#about-project)
- [Built With](#built-with)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## About Project

EDUVA is a powerful administrative platform designed to manage the EDUVA educational ecosystem. Built with Angular 18 and modern web technologies, it provides comprehensive tools for system administrators to oversee schools, users, payments, and educational content.

### Key Features:

- **Dashboard & Analytics**: Real-time statistics and insights about system usage, revenue, and user activity
- **Payment Management**: Comprehensive tracking of subscription plans and credit pack transactions
- **User Management**: Complete oversight of all user types including students, teachers, school admins, and content moderators
- **Subscription Plans**: Manage school subscription packages and pricing
- **Credit Pack Management**: Oversee teacher credit packages for content creation

## 🛠 Built With

### Frontend Framework

- **[Angular 18](https://angular.io/)** - Modern web application framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### UI/UX Libraries

- **[PrimeNG](https://primeng.org/)** - Rich UI component library
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[FontAwesome](https://fontawesome.com/)** - Icon library
- **[ApexCharts](https://apexcharts.com/)** - Interactive charts and graphs

### Backend Integration

- **[Supabase](https://supabase.com/)** - Backend as a Service
- **[Custom API](https://api.eduva.tech/)** - RESTful API for business logic

### Development Tools

- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Prettier](https://prettier.io/)** - Code formatter
- **[Custom Webpack](https://github.com/angular-builders/custom-webpack)** - Custom build configuration

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Minimum 4GB RAM recommended
- Stable internet connection for backend services

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tranduckhuy/eduva-admin.git
   cd eduva-admin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit environment file with your configuration
   # Required environment variables:
   # - BASE_API_URL: Your backend API URL
   # - CLIENT_URL: Frontend application URL
   # - SUPABASE_URL: Supabase project URL (for file storage)
   # - SUPABASE_KEY: Supabase anonymous key (for file storage)
   ```

4. **Start development server**

   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 🎮 Usage

### For System Administrators

- **Dashboard Overview**: Monitor system statistics, revenue trends, and user activity
- **User Management**:
- Manage students, teachers, school administrators, and content moderators
- View user profiles, subscription status, and credit balances
- Enable/disable user accounts and manage permissions
- **Payment Oversight**:
- Track subscription plan payments and revenue
- Monitor credit pack transactions for teachers
- Export payment invoices and generate reports
- **School Management**:
- Oversee educational institutions and their administrators
- Monitor school subscription status and usage
- **Subscription Plans**:
- Create and manage school subscription packages
- Set pricing tiers and feature limits
- **Credit Packs**:
- Configure teacher credit packages for content creation
- Manage pricing and bonus credit offerings

## 🔧 Available Scripts

```bash
# Development
npm start                  # Start development server
npm start:staging          # Start with staging configuration

# Building
npm run build              # Build for production
npm run build:staging      # Build for staging
npm run build:dev          # Build for development
npm run watch              # Build with watch mode

# Testing
npm test                   # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:ui            # Run tests with UI
```

## 📁 Project Structure

```
src/
├── app/
│   ├── core/              # Core functionality (auth, guards, interceptors)
│   │   ├── auth/          # Authentication services and models
│   │   ├── guards/        # Route guards
│   │   ├── interceptors/  # HTTP interceptors
│   │   └── layout/        # Layout components
│   ├── features/          # Feature modules
│   │   ├── dashboard/     # Dashboard and analytics
│   │   ├── payments/      # Payment management
│   │   ├── schools/       # School management
│   │   ├── students/      # Student user management
│   │   ├── teachers/      # Teacher user management
│   │   ├── school-admins/ # School admin management
│   │   ├── content-moderators/ # Content moderator management
│   │   ├── subscription-plans/ # Subscription plan management
│   │   ├── credit-packs/  # Credit pack management
│   │   └── system-config/ # System configuration
│   └── shared/            # Shared components and services
│       ├── components/    # Reusable UI components
│       ├── models/        # Data models and interfaces
│       ├── services/      # Shared services
│       └── utils/         # Utility functions
├── assets/                # Static assets
└── environments/          # Environment configurations
```

## 🔐 Environment Variables

The project uses `.env` files for environment configuration. The `.env` file is gitignored for security.

### Required Variables

```bash
# API Configuration
BASE_API_URL=your_backend_api_url
BASE_HUB_URL=your_signalr_hub_url
CLIENT_URL=your_frontend_url

# Supabase Storage
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

### Setup Instructions

1. Create `.env` file
2. Copy `.env.example` to `.env`
3. Fill in your actual values

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow Angular style guide
- Write unit tests for new features
- Ensure code passes linting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ for better education administration</p>
  <p>© 2025 EDUVA. All rights reserved.</p>
</div>
