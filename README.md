# iReporter: Empowering Citizens Against Corruption

![iReporter Logo](public/logo.png)

## Developed by Ham Kemboi

## 🌟 Overview

iReporter is a powerful web platform that empowers citizens to report corruption, request government intervention, and highlight issues requiring attention. Built with modern web technologies and enhanced with AI capabilities, this application serves as a digital bridge between citizens and authorities.

### Live Demo
[iReporter Live Application](https://ireporter-new.netlify.app/)

## ✨ Key Features

- **AI-Powered Smart Assistant**: Leveraging OpenAI's GPT-4.1-nano model to help users articulate their reports, categorize issues automatically, and provide guidance throughout the reporting process
- **Geolocation Integration**: Precise location capturing for accurate reporting of incidents
- **Real-time Status Tracking**: Users can monitor the progress of their reports from submission to resolution
- **Responsive Design**: Seamlessly adapts to any device with an intuitive interface optimized for both desktop and mobile experiences
- **Administrative Dashboard**: Comprehensive tools for officials to manage, prioritize, and respond to citizen reports

## 🛠️ Technology Stack

- **Frontend**: React 19 with TypeScript, styled with Tailwind CSS for a modern, responsive UI
- **Backend**: Convex for real-time database and serverless functions
- **Authentication**: Secure multi-provider authentication system
- **AI Integration**: OpenAI GPT-4.1-nano for report analysis and categorization
- **Notifications**: Real-time alert system for status updates
- **Visualization**: Interactive maps and data visualization components

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Convex account for backend services
- OpenAI API key for AI features

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/iReporter-Application.git
   cd iReporter-Application
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   CONVEX_DEPLOYMENT=your_convex_deployment_id
   CONVEX_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for mobile devices with:
- Adaptive navigation system that transforms based on screen size
- Touch-friendly interface elements
- Optimized form layouts for smaller screens
- Mobile-first design approach

## 🔒 Authentication

iReporter uses Convex Auth for secure authentication:
- Email/password authentication
- Anonymous sign-in option
- Secure session management

## 🌐 Deployment

### Frontend Deployment

The frontend is deployed on Netlify:

1. Build the project
   ```bash
   npm run build
   ```

2. Deploy to Netlify
   ```bash
   npx netlify deploy --prod
   ```

### Backend Deployment

The Convex backend is deployed using:

```bash
npx convex deploy
```

## 👨‍💻 Developer

**Ham Kemboi**
- Email: hamsimotwo@gmail.com
- Location: Syokimau, Nairobi

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the AI capabilities
- Convex for the backend infrastructure
- All contributors and testers who helped improve the application

---

© 2025 Ham Kemboi. All Rights Reserved.

