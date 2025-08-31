import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
  Trophy,
  ArrowRight,
  Home,
  RotateCcw,
  Zap,
  Award
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { AchievementBadge, ProgressRing, StreakCounter } from './AchievementBadge'

// Confetti component
const Confetti = () => {
  const confettiEmojis = ['🎉', '✨', '🌟', '💫', '🎊', '💜', '🧠']
  return (
    <div className="confetti-container">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${5 + Math.random() * 5}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        >
          {confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)]}
        </div>
      ))}
    </div>
  )
}

export default function SessionSummary() {
  const navigate = useNavigate()
  const { state, actions } = useApp()
  const [showConfetti, setShowConfetti] = useState(false)

  // Get today's completed tasks and sessions
  const today = new Date().toDateString()
  
  const todayCompletedTasks = state.tasks.filter(task => {
    const taskDate = new Date(task.completedAt).toDateString()
    return task.completed && taskDate === today
  })

  const todaySessions = state.sessionHistory.filter(session => {
    const sessionDate = new Date(session.startTime).toDateString()
    return sessionDate === today && session.completed
  })

  const totalFocusTimeToday = todaySessions.reduce((total, session) => {
    return total + ((session.endTime - session.startTime) / 1000 / 60) // minutes
  }, 0)

  const focusTimeHours = Math.floor(totalFocusTimeToday / 60)
  const remainingMinutes = Math.round(totalFocusTimeToday % 60)

  // Encouraging messages based on performance
  const getEncouragingMessage = () => {
    const messages = [
      "You showed up today — that's progress! 🌟",
      "Every small step forward is a victory worth celebrating! 🎉",
      "Your brain did amazing work today. Be proud! 💪",
      "Progress isn't always perfect, and that's perfectly okay! ✨",
      "You're building great habits, one session at a time! 🌱",
      "Remember: consistency beats perfection every time! 🎯",
      "Your future self will thank you for the work you did today! 💫"
    ]
    
    if (todayCompletedTasks.length >= 5) {
      return "Wow! You're on fire today! Amazing productivity! 🔥"
    } else if (totalFocusTimeToday >= 120) {
      return "Incredible focus time today! Your dedication is inspiring! ⭐"
    } else if (todayCompletedTasks.length >= 3) {
      return "Great job completing multiple tasks! You're making real progress! 🚀"
    } else if (totalFocusTimeToday >= 60) {
      return "An hour of focused work is fantastic! Keep it up! 💎"
    }
    
    return messages[Math.floor(Math.random() * messages.length)]
  }

  // Trigger confetti animation on mount
  useEffect(() => {
    setShowConfetti(true)
    const timer = setTimeout(() => setShowConfetti(false), 8000) // Confetti for 8 seconds
    return () => clearTimeout(timer)
  }, [])

  const earnedAchievements = state.achievements.filter(ach => new Date(ach.earnedAt).toDateString() === today)

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && <Confetti />}

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto" />
            <Sparkles className="w-8 h-8 absolute -top-2 -right-2 text-yellow-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Session Complete!</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Take a moment to celebrate your progress
          </p>
        </div>

        {/* Achievement Badges Earned Today */}
        {earnedAchievements.length > 0 && (
          <Card className="shadow-lg border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-yellow-600" />
                <span>Achievements Unlocked Today!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-4">
              {earnedAchievements.map(ach => (
                <div key={ach.id} className="text-center">
                  <AchievementBadge achievement={ach} size="lg" />
                  <p className="text-sm font-medium mt-2">{ach.name}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Encouraging Message */}
        <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 card-hover">
          <CardContent className="p-6 text-center">
            <p className="text-gray-700 font-medium text-lg">
              {getEncouragingMessage()}
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Completed Tasks */}
          <Card className="shadow-md card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                Tasks Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800 mb-3">
                {todayCompletedTasks.length}
              </div>
              <div className="space-y-2">
                {todayCompletedTasks.slice(-3).map((task) => (
                  <div key={task.id} className="flex items-center space-x-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">{task.title}</span>
                  </div>
                ))}
                {todayCompletedTasks.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{todayCompletedTasks.length - 3} more tasks
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Focus Time */}
          <Card className="shadow-md card-hover">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Focus Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-800 mb-3">
                {focusTimeHours > 0 ? `${focusTimeHours}h ${remainingMinutes}m` : `${remainingMinutes}m`}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  {todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''} completed
                </p>
                <p className="text-xs text-gray-500">
                  Average: {todaySessions.length > 0 ? Math.round(totalFocusTimeToday / todaySessions.length) : 0}m per session
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pet Progress (if gamification enabled) */}
          {state.user.preferences.gamificationEnabled && (
            <Card className="shadow-md card-hover">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Heart className="w-5 h-5 mr-2 text-pink-500" />
                  Focus Pet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800 mb-3">
                  Level {state.pet.level}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience</span>
                    <span className="text-gray-800">{state.pet.experience % 100}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(state.pet.experience % 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">
                    +{todaySessions.length * 15} XP earned today
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Streaks and Total Stats */}
        {state.user.preferences.gamificationEnabled && (
          <Card className="shadow-md bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 card-hover">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center space-y-3">
                <StreakCounter streak={state.streaks.current} isActive={true} />
                <p className="text-sm text-gray-600">Current Focus Streak</p>
                <p className="text-xs text-gray-500">Longest: {state.streaks.longest} days</p>
              </div>
              <div className="flex flex-col items-center space-y-3">
                <ProgressRing progress={(state.stats.totalFocusTime / 600) * 100} size={80} strokeWidth={6} color="#60a5fa" />
                <p className="text-sm text-gray-600">Total Focus Time</p>
                <p className="text-xs text-gray-500">{Math.floor(state.stats.totalFocusTime / 60)}h {Math.round(state.stats.totalFocusTime % 60)}m</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reflection Section */}
        <Card className="shadow-md bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
              Today's Wins
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">What you accomplished:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Stayed focused for {remainingMinutes} minutes</li>
                  <li>• Completed {todayCompletedTasks.length} task{todayCompletedTasks.length !== 1 ? 's' : ''}</li>
                  <li>• Practiced mindful productivity</li>
                  {state.user.preferences.gamificationEnabled && (
                    <li>• Grew your focus pet to level {state.pet.level}</li>
                  )}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Remember:</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Progress over perfection</li>
                  <li>• Every effort counts</li>
                  <li>• You're building great habits</li>
                  <li>• Rest is part of productivity</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/focus')}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 btn-animated"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Start Another Session
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/tasks')}
            className="px-8 py-4 btn-animated"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Manage Tasks
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 btn-animated"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Gentle Reminder */}
        <Card className="shadow-md bg-gradient-to-r from-green-50 to-blue-50 border-green-200 card-hover">
          <CardContent className="p-6 text-center">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Take a moment to breathe</h4>
              <p className="text-sm text-gray-600">
                Consider taking a short walk, stretching, or having some water before your next session
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



