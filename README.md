# Rental Management Dashboard

A professional, scalable Rental Management Dashboard built with Angular 17+ that manages rental agreements for multiple brands with comprehensive financial analysis and reporting capabilities.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Finance, Viewer)
- Secure login page with session management

### 🏢 Brands Management
- Add, edit, and delete brands
- Brand details: name, branch location, contact information
- Contract duration management
- Rental model selection (Fixed Monthly Rent or Percentage of Annual Sales)
- Document uploads and notes

### 📄 Rentals Management
- Create and track rental contracts
- Support for monthly rent and percentage-based rentals
- Automatic calculation of expected annual income
- Contract file management
- Renewal date tracking

### 💰 Financial Analysis
- Real-time profitability analysis (Profitable, Losing, Breaking Even)
- Rent cost vs expected revenue calculations
- Key metrics dashboard:
  - Total annual rental revenue
  - Number of brands and contracts
  - Average profit margin
  - Top profitable brands
  - Least profitable brands

### 📊 Reports Module
- Comprehensive rental reports
- Advanced filtering:
  - By brand
  - By contract type
  - By profitability status
  - By date range
- Export capabilities:
  - PDF export
  - Excel export
  - CSV export

### 📈 Dashboard & Charts
- Interactive charts using PrimeNG Chart component
- Visualizations:
  - Profitability distribution
  - Monthly revenue trends
  - Contract expiry timelines
  - Rental type comparison
- Responsive design with modern UI

### 🌍 Internationalization
- Full support for Arabic and English
- RTL (Right-to-Left) layout for Arabic
- Language switcher in the sidebar

## Technology Stack

- **Angular 17+** - Modern Angular framework
- **PrimeNG 17** - UI component library
- **NgRx** - State management
- **RxJS** - Reactive programming
- **TypeScript** - Type-safe JavaScript
- **SCSS** - Styling
- **Chart.js** - Charting library (via PrimeNG)
- **jsPDF & jsPDF-AutoTable** - PDF generation
- **xlsx** - Excel export

## Project Structure

```
src/
├── app/
│   ├── core/                    # Core functionality
│   │   ├── guards/              # Route guards (Auth, Role)
│   │   ├── interceptors/        # HTTP interceptors (JWT)
│   │   ├── models/              # Data models
│   │   └── services/            # Core services
│   ├── shared/                  # Shared components and modules
│   │   ├── components/          # Reusable components
│   │   └── services/            # Shared services (i18n)
│   ├── features/                # Feature modules
│   │   ├── auth/                # Authentication module
│   │   ├── brands/              # Brands management
│   │   ├── rentals/             # Rentals management
│   │   ├── financial/           # Financial analysis
│   │   ├── reports/             # Reports module
│   │   └── dashboard/           # Dashboard with charts
│   ├── layout/                  # Layout components
│   └── app.module.ts            # Root module
├── assets/                      # Static assets
├── environments/                # Environment configurations
└── styles.scss                  # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Usage

### Login

The application includes a mock authentication system. Use the following credentials for testing:

- **Admin**: username: `admin`, password: `any`
- **Finance**: username: `finance`, password: `any`
- **Viewer**: username: `viewer`, password: `any`

### Modules

1. **Dashboard**: Overview with key metrics and interactive charts
2. **Brands**: Manage brand information and details
3. **Rentals**: Create and manage rental contracts
4. **Financial**: View profitability analysis and financial metrics
5. **Reports**: Generate and export comprehensive reports

### Language Switching

Click the language switcher button in the sidebar to toggle between English and Arabic. The UI will automatically adjust for RTL layout.

## Architecture

### Modular Structure
- Lazy-loaded feature modules for optimal performance
- Shared module for reusable components
- Core module for singleton services and guards

### State Management
- NgRx store configured (ready for state management implementation)
- Reactive services using RxJS Observables

### Services
- **AuthService**: Authentication and authorization
- **BrandService**: Brand CRUD operations
- **RentalService**: Rental contract management
- **FinancialService**: Financial calculations and analysis
- **ReportService**: Report generation and export
- **I18nService**: Internationalization support

### Guards
- **AuthGuard**: Protects routes requiring authentication
- **RoleGuard**: Enforces role-based access control

## API Integration

The services are currently using mock data. To integrate with a real backend:

1. Update `environment.ts` with your API URL
2. Replace mock implementations in services with actual HTTP calls
3. Ensure your backend implements the expected endpoints

Example service method:
```typescript
getAllBrands(): Observable<Brand[]> {
  return this.http.get<Brand[]>(`${environment.apiUrl}/brands`);
}
```

## Customization

### Styling
- Global styles: `src/styles.scss`
- Component-specific styles: Inline styles in component files
- PrimeNG theme: Configured in `angular.json`

### Adding New Features
1. Create a new feature module in `src/app/features/`
2. Add route in `app-routing.module.ts`
3. Update sidebar menu in `layout.component.ts`

## Development

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Add comments for complex logic

### Testing
```bash
npm test
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary software.

## Support

For issues and questions, please contact the development team.

---

**Note**: This is a comprehensive dashboard system. Make sure to configure your backend API endpoints and implement proper security measures before deploying to production.

