import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Palette, 
  Brain, 
  Timer, 
  Volume2,
  Accessibility,
  Heart,
  RotateCcw,
  Trash2,
  Moon,
  Sun,
  Contrast
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Settings() {
  const navigate = useNavigate()
  const { state, actions } = useApp()
  const [preferences, setPreferences] = useState(state.user.preferences)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handlePreferenceChange = (key, value) => {
    const newPreferences = { ...preferences, [key]: value }
    setPreferences(newPreferences)
    actions.setUserPreferences(newPreferences)
  }

  const handleResetData = () => {
    if (showResetConfirm) {
      // Clear all data
      localStorage.clear()
      window.location.reload()
    } else {
      setShowResetConfirm(true)
      setTimeout(() => setShowResetConfirm(false), 5000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <SettingsIcon className="w-6 h-6 mr-2" />
            Settings
          </h1>
        </div>

        {/* Theme Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="w-5 h-5 mr-2 text-purple-600" />
              Visual Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-sm">
              Choose the color palette that feels most comfortable for your eyes and focus
            </p>
            
            <RadioGroup 
              value={preferences.theme} 
              onValueChange={(value) => handlePreferenceChange('theme', value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="light" id="settings-light" />
                <div className="flex items-center space-x-3 flex-1">
                  <Sun className="w-6 h-6 text-yellow-500" />
                  <div>
                    <Label htmlFor="settings-light" className="font-medium">Light Mode</Label>
                    <p className="text-sm text-gray-500">Clean and bright interface</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="dark" id="settings-dark" />
                <div className="flex items-center space-x-3 flex-1">
                  <Moon className="w-6 h-6 text-gray-600" />
                  <div>
                    <Label htmlFor="settings-dark" className="font-medium">Dark Mode</Label>
                    <p className="text-sm text-gray-500">Easy on the eyes in low light</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="high-contrast" id="settings-contrast" />
                <div className="flex items-center space-x-3 flex-1">
                  <Contrast className="w-6 h-6 text-gray-600" />
                  <div>
                    <Label htmlFor="settings-contrast" className="font-medium">High Contrast</Label>
                    <p className="text-sm text-gray-500">Maximum readability</p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Task & Focus Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2 text-blue-600" />
              Task & Focus Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Style */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Task Style</Label>
              <RadioGroup 
                value={preferences.taskStyle} 
                onValueChange={(value) => handlePreferenceChange('taskStyle', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="chunked" id="settings-chunked" />
                  <div>
                    <Label htmlFor="settings-chunked" className="font-medium">Break tasks into small chunks</Label>
                    <p className="text-sm text-gray-500">Perfect for ADHD minds - bite-sized steps</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="simple" id="settings-simple" />
                  <div>
                    <Label htmlFor="settings-simple" className="font-medium">Simple task list</Label>
                    <p className="text-sm text-gray-500">Clean and straightforward</p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Focus Timer */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Focus Timer Style</Label>
              <RadioGroup 
                value={preferences.focusTimerPreference} 
                onValueChange={(value) => handlePreferenceChange('focusTimerPreference', value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="adaptive" id="settings-adaptive" />
                  <div>
                    <Label htmlFor="settings-adaptive" className="font-medium">Adaptive timing</Label>
                    <p className="text-sm text-gray-500">Adjusts session length based on your focus patterns</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value="standard" id="settings-standard" />
                  <div>
                    <Label htmlFor="settings-standard" className="font-medium">Standard Pomodoro</Label>
                    <p className="text-sm text-gray-500">Classic 25-minute focus, 5-minute break</p>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Gamification & Motivation */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-600" />
              Motivation & Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-purple-500" />
                <div>
                  <h4 className="font-medium text-gray-800">Focus Pet & Badges</h4>
                  <p className="text-sm text-gray-600">
                    A gentle companion that grows as you achieve your goals
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.gamificationEnabled}
                onCheckedChange={(checked) => handlePreferenceChange('gamificationEnabled', checked)}
              />
            </div>
            
            {preferences.gamificationEnabled && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span className="font-medium text-gray-800">Current Pet Status</span>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>Level: {state.pet.level}</p>
                  <p>Experience: {state.pet.experience} XP</p>
                  <p>Next level: {100 - (state.pet.experience % 100)} XP to go</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Accessibility className="w-5 h-5 mr-2 text-green-600" />
              Accessibility & Comfort
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-blue-500" />
                  <div>
                    <Label className="font-medium">Sound Notifications</Label>
                    <p className="text-sm text-gray-500">Gentle chimes for session completion</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Timer className="w-5 h-5 text-purple-500" />
                  <div>
                    <Label className="font-medium">Visual Timer Animations</Label>
                    <p className="text-sm text-gray-500">Smooth progress animations</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-lg border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <RotateCcw className="w-5 h-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-gray-800 mb-2">Reset All Data</h4>
              <p className="text-sm text-gray-600 mb-3">
                This will permanently delete all your tasks, session history, and preferences. 
                This action cannot be undone.
              </p>
              <Button
                variant={showResetConfirm ? "destructive" : "outline"}
                onClick={handleResetData}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {showResetConfirm ? "Click again to confirm reset" : "Reset All Data"}
              </Button>
              {showResetConfirm && (
                <p className="text-xs text-red-600 mt-2 text-center">
                  This will reset everything. Click the button again to confirm.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="shadow-md bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-gray-800 mb-2">Neurodiverse-Friendly Study Buddy</h3>
            <p className="text-sm text-gray-600 mb-4">
              Designed with love for neurodiverse minds. Every brain is unique, and that's your superpower! 🧠✨
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Made with ❤️ for accessibility</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

