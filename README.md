# PolicyPal - Financial Management Platform

A comprehensive financial management application for tracking insurance policies, investments, documents, and alerts. Built with React, TypeScript, Firebase, and Tailwind CSS.

![PolicyPal](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.x-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Firebase](https://img.shields.io/badge/Firebase-10.x-ffca28)

## Features

- 📋 **Policy Management** - Track insurance policies with auto-renewal alerts
- 💰 **Investment Tracking** - Monitor portfolio performance and returns
- 🔔 **Smart Alerts** - Dynamic priority alerts based on due dates
- 📄 **Document Storage** - Upload and manage financial documents with expiry tracking
- 🔍 **Global Search** - Search across policies, investments, and alerts
- 📊 **PDF Export** - Generate comprehensive financial reports
- 🎨 **Dark/Light Mode** - Toggle between themes
- 🔒 **Session Security** - Auto-logout after 5 minutes of inactivity
- 👤 **Profile Management** - Manage personal information
- 🎓 **Interactive Tutorial** - Guided tour for first-time users

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Firebase (Authentication, Firestore)
- **State Management**: React Hooks
- **Routing**: React Router v6
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns
- **Icons**: Lucide React

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ and npm installed
- A Firebase account and project
- Git installed

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd my-policy-pal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Authentication** → Email/Password provider
4. Enable **Firestore Database** → Start in production mode
5. Get your Firebase configuration

#### Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Important**: Never commit `.env` to version control!

### 4. Deploy Firestore Rules

```bash
# Login to Firebase
firebase login

# Deploy security rules
firebase deploy --only firestore:rules
```

## Development

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Lint Code

```bash
npm run lint
```

## Deployment

### Deploy to Firebase Hosting

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy

# Or deploy only hosting
firebase deploy --only hosting
```

### Deploy to Other Platforms

The `dist/` folder can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## Project Structure

```
my-policy-pal/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── dialog/          # Modal dialogs
│   │   ├── layout/          # Layout components (Header, Sidebar)
│   │   ├── security/        # Security components (Session timeout)
│   │   ├── tutorial/        # Interactive tutorial
│   │   └── ui/              # Base UI components (Radix UI)
│   ├── hooks/               # Custom React hooks
│   │   ├── useFinancialData.ts
│   │   ├── useDocuments.ts
│   │   ├── useMoneyVisibility.tsx
│   │   ├── useTheme.ts
│   │   ├── useGlobalSearch.ts
│   │   └── useSessionTimeout.ts
│   ├── integrations/        # External service integrations
│   │   └── firebase/        # Firebase configuration
│   ├── lib/                 # Utility functions
│   │   └── exportPDF.ts     # PDF generation
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Main dashboard
│   │   ├── Auth.tsx         # Login/Signup
│   │   ├── Alerts.tsx       # Alerts management
│   │   ├── Documents.tsx    # Document storage
│   │   ├── Profile.tsx      # User profile
│   │   ├── Settings.tsx     # App settings
│   │   └── Notfound.tsx     # 404 page
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── docs/                    # Documentation
│   ├── USER_GUIDE.md        # User documentation
│   └── TECHNICAL_DOCUMENTATION.md
├── public/                  # Static assets
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
├── .env                     # Environment variables (not in repo)
├── package.json             # Dependencies
└── README.md                # This file
```

## Key Features Explained

### Auto-Alert System

When you add a policy, the system automatically:
1. Creates an alert 30 days before expiry
2. Sets priority based on days until expiry:
   - **Low**: >60 days
   - **Medium**: 31-60 days
   - **High**: ≤30 days
3. Updates priority as dates approach

### Session Timeout

- Monitors user activity (mouse, keyboard, scroll)
- Shows warning after 4 minutes of inactivity
- Auto-logout after 5 minutes
- User can extend session by clicking "Stay Logged In"

### Document Management

- Upload PDFs, images, and documents
- Store as base64 in Firestore (no Storage needed)
- Add expiry dates for personal documents (ID, License, Passport)
- View, download, or delete documents

### Global Search

- Real-time search across all data
- Searches policies, investments, and alerts
- Filters by name, provider, type, and more

## Environment Variables

Required environment variables:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |

## Firestore Collections

- **policies**: Insurance policy data
- **investments**: Investment portfolio data
- **alerts**: Reminders and notifications
- **documents**: Uploaded files (base64)
- **profiles**: User profile information

## Security

- Firebase Authentication for user management
- Firestore security rules ensure data isolation
- Session timeout after inactivity
- Money visibility toggle for privacy
- HTTPS-only communication

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Firebase Connection Issues

1. Verify `.env` file exists and has correct values
2. Check Firebase project settings
3. Ensure Firestore is enabled
4. Deploy security rules: `firebase deploy --only firestore:rules`

### Authentication Issues

1. Enable Email/Password provider in Firebase Console
2. Check Firebase Authentication settings
3. Verify security rules are deployed

## Documentation

Detailed documentation available in the `docs/` folder:

- **USER_GUIDE.md**: Non-technical user guide
- **TECHNICAL_DOCUMENTATION.md**: Technical reference for developers

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For issues or questions:
- Create an issue in the repository
- Email: support@policypal.com

## Changelog

### v1.0.0 (2024)
- Initial release
- Core features: Policies, Investments, Alerts, Documents
- Firebase integration
- Auto-alert system with dynamic priorities
- Global search functionality
- PDF export
- Interactive tutorial
- Session timeout security
- Dark/Light theme toggle
- Money visibility toggle

---

**Built with ❤️ using React, TypeScript, and Firebase**
