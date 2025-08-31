import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Heart, Brain, Sparkles, Moon, Sun, Contrast, Zap, Trophy, Target } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Onboarding({ onComplete }) {
  const navigate = useNavigate()
  const { actions } = useApp()
  const [currentStep, setCurrentStep] = useState(0)
  const [preferences, setPreferences] = useState(() => {
    // Initialize theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    return {
      theme: savedTheme,
      gamificationEnabled: true,
      taskStyle: 'chunked',
      focusTimerPreference: 'adaptive'
    };
  });
  
  // Apply theme when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.className = preferences.theme;
    localStorage.setItem('theme', preferences.theme);
  }, [preferences.theme]);

  const steps = [
    {
      title: 'Welcome to Your Study Buddy',
      content: (
        <div className="text-center space-y-6">
          <div className="relative">
            <Heart className="w-16 h-16 mx-auto text-pink-400 animate-pulse" />
            <Sparkles className="w-8 h-8 absolute -top-2 -right-2 text-yellow-400 animate-bounce" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 typewriter">
              A gentle space designed for neurodiverse minds
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              We understand that everyone learns differently. Let's set up your perfect study environment together.
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Choose Your Visual Theme',
      content: (
        <div className="space-y-6">
          <p className="text-center text-gray-600">
            Select the color palette that feels most comfortable for you
          </p>
          <div className="grid gap-4">
            <button
              onClick={() => {
                setPreferences(prev => ({ ...prev, theme: 'light' }));
              }}
              className={`flex items-center space-x-4 p-6 rounded-xl border-2 transition-all duration-200 ${
                preferences.theme === 'light' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-[1.02]' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${preferences.theme === 'light' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Sun className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800 dark:text-gray-200">Light Mode</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Clean and bright interface</div>
              </div>
              {preferences.theme === 'light' && (
                <div className="ml-auto p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              )}
            </button>
            
            <button
              onClick={() => {
                setPreferences(prev => ({ ...prev, theme: 'dark' }));
              }}
              className={`flex items-center space-x-4 p-6 rounded-xl border-2 transition-all duration-200 ${
                preferences.theme === 'dark' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-[1.02]' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${preferences.theme === 'dark' ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Moon className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800 dark:text-gray-200">Dark Mode</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Easy on the eyes in low light</div>
              </div>
              {preferences.theme === 'dark' && (
                <div className="ml-auto p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              )}
            </button>
            
            <button
              onClick={() => {
                setPreferences(prev => ({ ...prev, theme: 'high-contrast' }));
              }}
              className={`flex items-center space-x-4 p-6 rounded-xl border-2 transition-all duration-200 ${
                preferences.theme === 'high-contrast' 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-[1.02]' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className={`p-2 rounded-lg ${preferences.theme === 'high-contrast' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Contrast className="w-6 h-6 text-amber-500" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800 dark:text-gray-200">High Contrast</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Maximum readability</div>
              </div>
              {preferences.theme === 'high-contrast' && (
                <div className="ml-auto p-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              )}
            </button>
          </div>
        </div>
      )
    },
    {
      title: 'Focus Timer Preference',
      content: (
        <div className="space-y-6">
          <p className="text-center text-gray-600">
            How would you like your focus sessions to work?
          </p>
          
          <div className="grid gap-4">
            <button
              onClick={() => setPreferences(prev => ({ ...prev, focusTimerPreference: 'adaptive' }))}
              className={`flex items-center space-x-4 p-6 rounded-xl border-2 transition-all duration-300 btn-animated card-hover ${
                preferences.focusTimerPreference === 'adaptive' 
                  ? 'border-purple-400 bg-purple-50 shadow-lg' 
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <Zap className="w-8 h-8 text-yellow-500" />
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-800">Adaptive Timing</div>
                <div className="text-sm text-gray-600">Adjusts session length based on your focus patterns</div>
              </div>
              {preferences.focusTimerPreference === 'adaptive' && (
                <Sparkles className="w-6 h-6 text-purple-500" />
              )}
            </button>
            
            <button
              onClick={() => setPreferences(prev => ({ ...prev, focusTimerPreference: 'standard' }))}
              className={`flex items-center space-x-4 p-6 rounded-xl border-2 transition-all duration-300 btn-animated card-hover ${
                preferences.focusTimerPreference === 'standard' 
                  ? 'border-purple-400 bg-purple-50 shadow-lg' 
                  : 'border-gray-200 hover:border-purple-200'
              }`}
            >
              <Target className="w-8 h-8 text-blue-500" />
              <div className="text-left flex-1">
                <div className="font-semibold text-gray-800">Standard Pomodoro</div>
                <div className="text-sm text-gray-600">Classic 25-minute focus, 5-minute break</div>
              </div>
              {preferences.focusTimerPreference === 'standard' && (
                <Sparkles className="w-6 h-6 text-purple-500" />
              )}
            </button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-700">
              <Brain className="w-5 h-5" />
              <span className="font-medium">Smart Task Chunking Enabled</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              We'll automatically break down complex tasks into manageable steps - perfect for neurodiverse minds!
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Motivation & Rewards',
      content: (
        <div className="space-y-6">
          <p className="text-center text-gray-600">
            Choose your motivation style to keep you engaged
          </p>
          
          <div className="space-y-4">
            <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              preferences.gamificationEnabled ? 'border-purple-400 bg-purple-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Brain className="w-12 h-12 text-purple-500" />
                    <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-yellow-400 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Focus Pet & Badges</h3>
                    <p className="text-sm text-gray-600">
                      A gentle companion that grows as you achieve your goals
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preferences.gamificationEnabled}
                  onCheckedChange={(checked) => 
                    setPreferences(prev => ({ ...prev, gamificationEnabled: checked }))
                  }
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <Trophy className="w-8 h-8 text-yellow-600 mb-2" />
                <div className="font-medium text-gray-800">Achievement Badges</div>
                <div className="text-xs text-gray-600">Unlock rewards for milestones</div>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <Zap className="w-8 h-8 text-green-600 mb-2" />
                <div className="font-medium text-gray-800">Focus Streaks</div>
                <div className="text-xs text-gray-600">Build momentum with consistency</div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            Don't worry - you can change these settings anytime in your preferences
          </div>
        </div>
      )
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      actions.setUserPreferences(preferences)
      localStorage.setItem('onboarding_complete', 'true')
      onComplete()
      navigate('/dashboard')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl card-hover">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-purple-500 pulse-glow' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="min-h-[350px]">
            {steps[currentStep].content}
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 btn-animated"
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              className="px-6 bg-purple-600 hover:bg-purple-700 btn-animated pulse-glow"
            >
              {currentStep === steps.length - 1 ? 'Get Started!' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

