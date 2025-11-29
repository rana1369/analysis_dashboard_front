# Quick Start Guide

## Installation Steps

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - Open your browser and navigate to `http://localhost:4200`
   - You'll be redirected to the login page

## Login Credentials

The application uses mock authentication. Use any of these:

- **Admin User**: 
  - Username: `admin`
  - Password: `any password`

- **Finance User**: 
  - Username: `finance`
  - Password: `any password`

- **Viewer User**: 
  - Username: `viewer`
  - Password: `any password`

## First Steps After Login

1. **Explore the Dashboard**: View key metrics and charts
2. **Add a Brand**: Go to Brands module and add your first brand
3. **Create a Rental**: Add a rental contract for the brand
4. **View Financial Analysis**: Check profitability metrics
5. **Generate Reports**: Create and export reports

## Project Structure Overview

- `src/app/core/` - Core services, guards, interceptors, models
- `src/app/shared/` - Shared components and modules
- `src/app/features/` - Feature modules (auth, brands, rentals, etc.)
- `src/app/layout/` - Layout components (sidebar, header)

## Key Features to Try

### 1. Language Switching
Click the language button in the sidebar to switch between English and Arabic. Notice the RTL layout change.

### 2. Brands Management
- Add a new brand with rental details
- Edit existing brands
- Delete brands (Admin only)

### 3. Rentals Management
- Create rental contracts
- View expected annual income calculations
- Manage contract files

### 4. Financial Analysis
- View profitability status for each contract
- See top and least profitable brands
- Check key financial metrics

### 5. Reports
- Filter reports by various criteria
- Export to PDF, Excel, or CSV
- View comprehensive rental data

### 6. Dashboard Charts
- Profitability distribution chart
- Monthly revenue trends
- Contract expiry timeline
- Rental type comparison

## Development Tips

1. **Mock Data**: The application currently uses mock data. To connect to a real backend:
   - Update `src/environments/environment.ts` with your API URL
   - Replace mock implementations in services with HTTP calls

2. **Adding New Features**:
   - Create a new feature module in `src/app/features/`
   - Add route in `src/app/app-routing.module.ts`
   - Update sidebar menu in `src/app/layout/layout.component.ts`

3. **Styling**:
   - Global styles: `src/styles.scss`
   - Component styles: Inline in component files
   - PrimeNG theme: Configured in `angular.json`

## Troubleshooting

### Port Already in Use
If port 4200 is busy, use:
```bash
ng serve --port 4201
```

### Build Errors
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
Ensure you're using TypeScript 5.2+:
```bash
npm install typescript@~5.2.2 --save-dev
```

## Next Steps

1. **Backend Integration**: Connect to your API
2. **Authentication**: Implement real JWT authentication
3. **File Uploads**: Configure file storage for documents
4. **State Management**: Implement NgRx stores for complex state
5. **Testing**: Add unit and e2e tests
6. **Deployment**: Build and deploy to production

## Support

For issues or questions, refer to the main README.md file or contact the development team.

