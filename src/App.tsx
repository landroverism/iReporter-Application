import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { LandingPage } from "./components/LandingPage";
import { Footer } from "./components/Footer";
import { AboutUs } from "./components/AboutUs";
import { HowItWorks } from "./components/HowItWorks";
import { ReportForm } from "./components/ReportForm";
import { Navigation } from "./components/Navigation";
import { useState } from "react";

type PageType = 'home' | 'about' | 'report' | 'dashboard' | 'howItWorks';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const handleNavigation = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleStartReporting = () => {
    if (loggedInUser) {
      setCurrentPage('report');
    } else {
      // Scroll to sign in form
      const signInElement = document.getElementById('sign-in-section');
      signInElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigation}
        isLoggedIn={!!loggedInUser}
      />
      
      <main className="flex-1">
        <Content 
          currentPage={currentPage} 
          onStartReporting={handleStartReporting}
          onNavigate={handleNavigation}
        />
      </main>
      
      <Footer onNavigate={handleNavigation} />
      <Toaster />
    </div>
  );
}

function Content({ 
  currentPage, 
  onStartReporting, 
  onNavigate 
}: { 
  currentPage: PageType;
  onStartReporting: () => void;
  onNavigate: (page: PageType) => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Authenticated>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'report' && <ReportForm />}
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'howItWorks' && <HowItWorks />}
        {currentPage === 'home' && <Dashboard />}
      </Authenticated>
      
      <Unauthenticated>
        {currentPage === 'about' && <AboutUs />}
        {currentPage === 'howItWorks' && <HowItWorks />}
        {currentPage === 'home' && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <LandingPage onStartReporting={onStartReporting} onLearnMore={() => onNavigate('about')} />
            <div id="sign-in-section" className="mt-12 max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-center mb-6">Sign In to Get Started</h3>
                <SignInForm />
              </div>
            </div>
          </div>
        )}
        {(currentPage === 'report' || currentPage === 'dashboard') && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
              <p className="text-gray-600 mb-8">Please sign in to access this feature.</p>
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <SignInForm />
                </div>
              </div>
            </div>
          </div>
        )}
      </Unauthenticated>
    </div>
  );
}
