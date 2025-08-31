import { useState, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

// Components
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import TaskManager from './components/TaskManager'
import FocusSession from './components/FocusSession'
import Settings from './components/Settings'
import SessionSummary from './components/SessionSummary'
import ReadingReview from './components/ReadingReview'
import NoteTaking from './components/NoteTaking'

// Context for global state
import { AppProvider, useApp } from './context/AppContext'
import logoImage from './assets/logo.png'

// Floating Elements Component
const FloatingElements = () => (
  <div className="floating-elements">
    <div className="floating-element text-4xl">🧠</div>
    <div className="floating-element text-3xl">✨</div>
    <div className="floating-element text-2xl">💜</div>
    <div className="floating-element text-3xl">🌟</div>
  </div>
);

// Theme Background Component with improved animations
const ThemeBackground = ({ theme }) => {
  const getBackgroundClass = () => {
    switch (theme) {
      case 'dark':
        return 'animated-background-dark';
      case 'high-contrast':
        return 'bg-gray-900 text-white';
      case 'light':
      default:
        return 'animated-background-light';
    }
  };

  const themeTransition = {
    type: 'spring',
    stiffness: 200,
    damping: 20
  };

  return (
    <motion.div 
      key={theme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={themeTransition}
      className={`fixed inset-0 ${getBackgroundClass()} -z-10 transition-colors duration-300`}
    >
      <FloatingElements />
    </motion.div>
  );
};

// App Content Component
function AppContent() {
  const [isOnboarded, setIsOnboarded] = useState(false)
  const { state, dispatch } = useApp()
  const theme = state?.user?.preferences?.theme || 'light'
  
  // Apply theme class to document and persist preference
  useEffect(() => {
    const root = window.document.documentElement;
    root.className = theme;
    localStorage.setItem('theme', theme);
    
    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', 
        theme === 'dark' ? '#0f172a' : 
        theme === 'high-contrast' ? '#000000' : 
        '#ffffff'
      );
    }
  }, [theme]);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingComplete = localStorage.getItem('onboarding_complete')
    setIsOnboarded(onboardingComplete === 'true')
  }, [])

  return (
    <AnimatePresence mode="wait">
      <ThemeBackground theme={theme} />
      <div className="relative z-10 min-h-screen">
        {/* Animated Header */}
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-md"
              >
                <img src={logoImage} alt="NeuroBuddy" className="w-8 h-8" />
                <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent text-sm">
                  NeuroBuddy
                </span>
              </motion.div>
              
              <nav className="flex items-center space-x-2">
                <ThemeToggle />
                <UserMenu />
              </nav>
            </div>
          </div>
        </motion.header>

        <main className="pt-20 px-4 pb-6">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={
                  <motion.div
                    key="home-redirect"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {isOnboarded ? <Navigate to="/dashboard" /> : <Navigate to="/onboarding" />}
                  </motion.div>
                } 
              />
              <Route 
                path="/onboarding" 
                element={
                  <motion.div
                    key="onboarding"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Onboarding onComplete={() => {
                      setIsOnboarded(true);
                      // Trigger confetti on onboarding completion
                      if (window.confetti) {
                        window.confetti({
                          particleCount: 100,
                          spread: 70,
                          origin: { y: 0.6 }
                        });
                      }
                    }} />
                  </motion.div>
                } 
              />
              
              {/* Animated Route Transitions */}
              <Route 
                path="/dashboard" 
                element={
                  <AnimatedPage>
                    <Dashboard />
                  </AnimatedPage>
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <AnimatedPage>
                    <TaskManager />
                  </AnimatedPage>
                } 
              />
              <Route 
                path="/focus" 
                element={
                  <AnimatedPage>
                    <FocusSession />
                  </AnimatedPage>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <AnimatedPage>
                    <Settings />
                  </AnimatedPage>
                } 
              />
              <Route 
                path="/summary" 
                element={
                  <AnimatedPage>
                    <SessionSummary />
                  </AnimatedPage>
                } 
              />
              <Route 
                path="/reading" 
                element={
                  <AnimatedPage>
                    <ReadingReview />
                  </AnimatedPage>
                } 
              />
              <Route 
                path="/notes" 
                element={
                  <AnimatedPage>
                    <NoteTaking />
                  </AnimatedPage>
                } 
              />
            </Routes>
          </AnimatePresence>
          
          {/* Toast Notifications */}
          <ToastContainer 
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={theme === 'dark' ? 'dark' : 'light'}
          />
        </main>
      </div>
    </AnimatePresence>
  );
}

// Animated Page Wrapper
const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Theme Toggle Component
const ThemeToggle = () => {
  const { state, dispatch } = useApp();
  const theme = state?.user?.preferences?.theme || 'light';
  
  const toggleTheme = () => {
    const themes = ['light', 'dark', 'high-contrast'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    dispatch({
      type: 'SET_USER_PREFERENCES',
      payload: { ...state.user.preferences, theme: nextTheme }
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md text-gray-800 dark:text-white"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? '🌞' : theme === 'dark' ? '🌙' : '🖥️'}
    </motion.button>
  );
};

// User Menu Component
const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center shadow-md"
        aria-label="User menu"
      >
        👤
      </motion.button>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 z-50"
        >
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Profile
          </button>
          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
            Settings
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
          <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
            Sign out
          </button>
        </motion.div>
      )}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-background text-foreground">
          <AppContent />
        </div>
      </Router>
    </AppProvider>
  )
}

export default App

