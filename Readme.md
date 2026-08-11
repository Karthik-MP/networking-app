# Networking App for Indian Community

A comprehensive React Native mobile application designed to connect Indian professionals (Green Card holders, H1-B visa holders) with job seekers and students in the Indian community. The platform enables referral opportunities, networking, events, and mentorship.

## 🚀 Features

### Core Features
- **Job Referrals**: Green card or H1-B holders can post job openings they can refer to
- **Networking**: Connect with professionals in the Indian community
- **Events**: Create and discover community events
- **Mentorship**: Find mentors or become one
- **Profile Management**: Comprehensive profile with education, experience, interests, and social links
- **Resume & Profile Picture Upload**: Upload and manage professional documents

### User Profiles Include
- Education history
- Work experience
- Interests and skills
- Social media links
- Resume (PDF format)
- Profile picture

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React Native (v0.79.6) with Expo (v54.0.21)
- **Navigation**: React Navigation (Bottom Tabs, Stack, Native Stack)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: 
  - React Context API (Auth, Theme)
  - React Query (@tanstack/react-query)
- **Forms**: React Hook Form
- **UI Components**: 
  - Expo Vector Icons
  - React Native Toast Message
  - React Native Circular Progress
  - Expo Blur, Linear Gradient, Haptics
- **Image Handling**: Expo Image Picker, Image Manipulator
- **Storage**: AsyncStorage

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js (v5.1.0)
- **Authentication**: Firebase Admin SDK
- **CORS**: Enabled for cross-origin requests

### Database & Storage
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
  - Resumes: `/resumes/{uid}.pdf`
  - Avatars: `/avatars/{uid}.jpg`

## 📁 Project Structure

```
networking-app-old/
├── client/                    # React Native mobile app
│   ├── components/           # Reusable UI components
│   │   ├── layout/          # Header, Screen layout components
│   │   ├── profile/         # Profile-related components
│   │   ├── Location/        # Location picker
│   │   └── Loading/         # Loading components
│   ├── screens/             # Application screens
│   │   ├── DashboardScreen.js
│   │   ├── JobsListScreen.jsx
│   │   ├── JobDetailScreen.jsx
│   │   ├── JobReferralCreateScreen.jsx
│   │   ├── EventCreateScreen.jsx
│   │   ├── MentorshipScreen.jsx
│   │   ├── MyNetwork.jsx
│   │   ├── ProfileScreen.jsx
│   │   ├── SignupScreen.jsx
│   │   └── WelcomeScreen.jsx
│   ├── navigations/         # Navigation stacks
│   │   ├── AuthStack.jsx
│   │   ├── TabNavigator.jsx
│   │   ├── CreateStack.jsx
│   │   ├── JobStack.jsx
│   │   └── NetworkStack.jsx
│   ├── contexts/            # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── services/            # API and Firebase services
│   │   ├── firebase.js
│   │   ├── jobReferralService.js
│   │   ├── eventService.js
│   │   ├── connectionServices.js
│   │   ├── userProfile.js
│   │   └── storage.js
│   ├── hooks/               # Custom React hooks
│   ├── constants/           # App constants and routes
│   └── assets/              # Images and static files
│
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   │   └── userRoutes.js
│   │   ├── middleware/     # Authentication middleware
│   │   └── services/       # Business logic
│   └── app.js             # Express app entry point
│
├── firebase/               # Firebase configuration
├── docs/                   # Project documentation
└── docker-compose.yml      # Docker configuration

```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm
- Expo CLI
- Android Studio (for Android development) or Xcode (for iOS development)
- Firebase project setup

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd networking-app-old
```

#### 2. Install Client Dependencies
```bash
cd client
pnpm install
# or
npm install
```

#### 3. Install Server Dependencies
```bash
cd ../server
npm install
```

#### 4. Firebase Configuration

Create Firebase configuration files:

**Client**: Update `client/services/firebase.js` with your Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

**Server**: Place your `firebase-admin` service account JSON in `server/google-services.json`

### Running the Application

#### Start the Backend Server
```bash
cd server
npm start
```
The server will run on `http://localhost:3001`

#### Start the Client (Expo)
```bash
cd client
pnpm start
# or
npm start
```

Then choose your platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for Web

#### Run on Android Device
```bash
pnpm android
# or
npm run android
```

#### Run on iOS Device
```bash
pnpm ios
# or
npm run ios
```

## 📱 App Navigation

### Main Tabs
1. **Dashboard**: Main feed and updates
2. **Jobs**: Browse and create job referrals
3. **Network**: Connect with other professionals
4. **Events**: Discover and create events
5. **Profile**: Manage your professional profile

### Additional Stacks
- **Auth Stack**: Login, Signup, Welcome screens
- **Create Stack**: Job referral and event creation
- **Job Stack**: Job listings and details
- **Network Stack**: Networking features

## 🔑 Key Features Detail

### Job Referrals
Post job referrals with the following information:
- Job title
- Company (name, locations, industry)
- Position type (with dropdown options)
- Work mode (remote, hybrid, onsite)
- Salary range
- Job description
- Number of applicants for referral
- Job posting link
- Referral deadline
- Job application deadline

### Profile Sections
- **Basic Info**: Name, headline, location
- **Education**: Schools, degrees, dates
- **Experience**: Companies, roles, dates
- **Interests**: Skills and interests
- **Social Links**: LinkedIn, GitHub, Twitter, etc.
- **Documents**: Resume upload (PDF)
- **Avatar**: Profile picture with compression

## 🎨 Styling

The app uses **NativeWind**, which brings Tailwind CSS to React Native. Theme support includes:
- Light and Dark mode
- Custom color schemes
- Consistent component styling across the app

## 🔐 Authentication

Firebase Authentication is used for:
- Email/Password authentication
- Session management
- Protected routes
- Token-based API authentication

## 🗄️ Database Structure

### Firestore Collections
- `users`: User profiles and information
- `jobReferrals`: Job referral postings
- `events`: Community events
- `connections`: Network connections between users
- `mentorships`: Mentorship relationships

### Firebase Storage
- `/resumes/{uid}.pdf`: User resumes
- `/avatars/{uid}.jpg`: User profile pictures (compressed)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Notes

### Current Status
- ✅ Authentication (Login, Signup)
- ✅ Profile Management (with all sections)
- ✅ Job Referrals
- ✅ Events
- ✅ Networking
- ✅ File Uploads (Resume, Profile Picture)
- ✅ Theme Support (Light/Dark mode)

### Build Commands
Refer to `client/build_commands.md` for Android build instructions and EAS build configuration.

## 📄 License

[Add your license here]

## 📧 Contact

[Add your contact information here]

---

**Note**: This is a community-focused networking application specifically designed for Indian professionals in the tech industry to help each other through referrals, networking, and mentorship opportunities.
