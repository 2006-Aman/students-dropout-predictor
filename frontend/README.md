# Student Dropout Predictor - Frontend

A modern, responsive React frontend for the Student Dropout Predictor system built with Vite, Tailwind CSS, shadcn/ui, and Recharts.

## 🚀 Features

### 🎨 Modern UI/UX
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Mode** - Toggle between themes
- **Smooth Animations** - Framer Motion for delightful interactions
- **Clean Design** - shadcn/ui components with Tailwind CSS

### 📊 Interactive Dashboard
- **Overview Cards** - Key metrics at a glance
- **Risk Distribution** - Pie chart showing risk levels
- **Feature Importance** - Bar chart of top features
- **Risk Trends** - Line chart over time
- **Global SHAP** - Visual feature impact analysis

### 📁 Data Management
- **Drag & Drop Upload** - Easy CSV file upload
- **Data Preview** - First 50 rows preview
- **Column Mapping** - Auto-detect and map columns
- **Template Download** - Sample CSV template

### 👥 High-Risk Students
- **Sortable Table** - Filter and sort students
- **Bulk Selection** - Select multiple students
- **Detailed View** - Modal with student details
- **Intervention Recommendations** - AI-generated suggestions
- **Export Options** - CSV and PDF export

### 📈 Reports & Analytics
- **Multiple Export Formats** - CSV, PDF, individual reports
- **Download History** - Track generated reports
- **Export Statistics** - Usage metrics

### ⚙️ Settings & Configuration
- **Risk Thresholds** - Adjustable probability thresholds
- **Model Management** - Retrain and monitor model
- **Privacy Controls** - Data retention settings
- **Security Options** - Role-based access control

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Radix UI** - Headless components

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open in browser:**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   └── pages/        # Page components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── tailwind.config.js    # Tailwind configuration
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6)
- **High Risk**: Red (#ef4444)
- **Medium Risk**: Orange (#f97316)
- **Low Risk**: Green (#22c55e)
- **Muted**: Gray (#6b7280)

### Components
- **Cards**: Rounded corners, soft shadows
- **Buttons**: Multiple variants and sizes
- **Badges**: Risk level indicators
- **Tables**: Sortable and filterable
- **Modals**: Student detail views

### Animations
- **Page Transitions**: Smooth fade and slide
- **Hover Effects**: Subtle lift and shadow
- **Loading States**: Pulse animations
- **Form Interactions**: Focus and validation

## 🔧 Configuration

### Theme
The app supports light, dark, and system themes. Theme preference is stored in localStorage.

### Risk Thresholds
- **High Risk**: ≥ 65% (configurable)
- **Medium Risk**: 35% - 65% (configurable)
- **Low Risk**: < 35% (configurable)

### Data Export
- **CSV**: Full dataset with predictions
- **PDF**: Summary reports with charts
- **Individual**: Per-student detailed reports

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Collapsible sidebar
- Touch-friendly interactions
- Optimized table views
- Swipe gestures

## 🚀 Performance

### Optimizations
- **Code Splitting**: Lazy-loaded components
- **Tree Shaking**: Unused code elimination
- **Image Optimization**: WebP format support
- **Bundle Analysis**: Vite bundle analyzer

### Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🔒 Security

### Data Protection
- **No Data Storage**: Client-side only
- **Secure Uploads**: File validation
- **XSS Protection**: React's built-in protection
- **CSRF Protection**: Same-origin policy

### Privacy
- **Local Processing**: No external data sharing
- **Auto-delete**: Configurable data retention
- **Access Control**: Role-based permissions

## 🧪 Testing

### Test Commands
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

### Test Coverage
- **Unit Tests**: Component testing
- **Integration Tests**: Page flow testing
- **E2E Tests**: User journey testing

## 📦 Deployment

### Build Output
The build creates a `dist` folder with:
- Static HTML, CSS, and JS files
- Optimized assets
- Service worker for caching

### Deployment Options
- **Vercel**: One-click deployment
- **Netlify**: Drag and drop deployment
- **AWS S3**: Static website hosting
- **Docker**: Containerized deployment

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Style
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Conventional Commits**: Commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the component examples

---

**Built with ❤️ for educational institutions worldwide**