import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  CheckSquare,
  Settings,
  Brain,
  Clock,
  Target,
  Sparkles,
  Heart,
  Trophy,
  Zap,
  Award,
  BookOpen,
  PenTool,
  Plus,
  Check,
  X,
  Star,
  Flame,
  Clock3,
  CheckCircle2,
  CircleDashed,
  BarChart3
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { ProgressRing, StreakCounter, AchievementBadge } from './AchievementBadge'
import FocusPet from './FocusPet'

export default function Dashboard() {
  const navigate = useNavigate()
  const { state, actions } = useApp()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const completedTasksToday = state.tasks.filter(task => {
    const today = new Date().toDateString()
    const taskDate = new Date(task.createdAt).toDateString() // Use createdAt for initial task creation date
    return task.completed && taskDate === today
  }).length

  const totalTasksToday = state.tasks.filter(task => {
    const today = new Date().toDateString()
    const taskDate = new Date(task.createdAt).toDateString()
    return taskDate === today
  }).length

  const todayFocusTime = state.sessionHistory
    .filter(session => {
      const today = new Date().toDateString()
      const sessionDate = new Date(session.startTime).toDateString()
      return sessionDate === today && session.completed
    })
    .reduce((total, session) => {
      return total + ((session.endTime - session.startTime) / 1000 / 60) // minutes
    }, 0)

  const focusTimeMinutes = Math.round(todayFocusTime)

  const handleStartFocusSession = () => {
    if (state.tasks.filter(task => !task.completed).length === 0) {
      // If no incomplete tasks, navigate to task manager first
      navigate('/tasks')
    } else {
      navigate('/focus')
    }
  }

  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Calculate task completion percentage
  const taskCompletionPercentage = totalTasksToday > 0 
    ? Math.round((completedTasksToday / totalTasksToday) * 100) 
    : 0;

  // Get top priority tasks
  const priorityTasks = state.tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    })
    .slice(0, 3);

  // Handle task completion
  const toggleTaskCompletion = (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      if (task.completed) {
        // Mark as incomplete
        actions.updateTask({ ...task, completed: false, completedAt: null });
      } else {
        // Mark as complete with animation
        actions.completeTask(taskId);
      }
    }
  };

  return (
    <div className="min-h-screen p-4 pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Date and Greeting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {greeting}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {today} • Ready to make progress on your goals today?
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              {state.streaks?.current || 0} day streak
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              Level {state.pet?.level || 1}
            </Badge>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Focus Session and Tasks */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Focus Button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="shadow-lg border-2 border-purple-200 dark:border-purple-900 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800 card-hover overflow-hidden">
                <CardContent className="p-6 text-center relative">
                  <div className="absolute top-0 right-0 p-2">
                    <Badge variant="secondary" className="text-xs">
                      <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                      Focus Mode
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mx-auto">
                        <Play className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                      </div>
                      <Sparkles className="w-6 h-6 absolute -top-1 -right-1 text-yellow-500 animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Start Focus Session
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                        Begin a gentle, focused work session tailored to your preferences
                      </p>
                    </div>
                    <Button 
                      size="lg"
                      className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={handleStartFocusSession}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Play className="w-5 h-5" />
                        <span>Start Focusing</span>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Today's Focus</div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {Math.floor(focusTimeMinutes / 60)}h {focusTimeMinutes % 60}m
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Tasks Done</div>
                <div className="text-lg font-bold text-pink-600 dark:text-pink-400">
                  {completedTasksToday}/{totalTasksToday || '0'}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800/50 p-3 rounded-lg border dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">Completion</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {taskCompletionPercentage}%
                </div>
              </div>
            </div>
            
            {/* Tasks Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="shadow-lg border border-gray-100 dark:border-gray-800">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-purple-600" />
                      Today's Tasks
                    </CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-800"
                      onClick={() => navigate('/tasks')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {priorityTasks.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {priorityTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="group flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 transition-colors ${
                              task.completed 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 dark:border-gray-600 hover:border-purple-500'
                            }`}
                          >
                            {task.completed && <Check className="w-3 h-3" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`truncate ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
                                {task.title}
                              </span>
                              {task.priority === 'high' && (
                                <Badge variant="destructive" className="text-xs">
                                  High
                                </Badge>
                              )}
                              {task.priority === 'medium' && (
                                <Badge variant="warning" className="text-xs">
                                  Medium
                                </Badge>
                              )}
                            </div>
                            {task.dueDate && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                                <Clock3 className="w-3 h-3 mr-1" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-gray-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit
                              }}
                            >
                              <PenTool className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="mx-auto w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-8 h-8 text-purple-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No tasks for today</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">Add a task to get started</p>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/tasks')}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50 dark:border-gray-700 dark:text-purple-400 dark:hover:bg-gray-800"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Right Column - Focus Pet and Stats */}
          <div className="space-y-6">
            <FocusPet />
            
            {/* Quick Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="shadow-lg border border-gray-100 dark:border-gray-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Focus Time</span>
                        <span>12h 45m</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Tasks Completed</span>
                        <span>8/12</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-1">
                        <span>Productivity</span>
                        <span>82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Daily Motivation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="shadow-lg border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">Daily Motivation</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        "Progress is progress, no matter how small. Celebrate every step forward!"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                <Target className="w-4 h-4 mr-2 text-green-500" />
                Tasks Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-800">
                  {completedTasksToday}/{totalTasksToday}
                </div>
                <Progress 
                  value={totalTasksToday > 0 ? (completedTasksToday / totalTasksToday) * 100 : 0} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-blue-500" />
                Focus Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">
                {focusTimeMinutes}m
              </div>
              <p className="text-sm text-gray-500">Today</p>
            </CardContent>
          </Card>

          {state.user.preferences.gamificationEnabled && (
            <Card className="shadow-md card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  Focus Pet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-800">
                    Level {state.pet.level}
                  </div>
                  <Progress 
                    value={(state.pet.experience % 100)} 
                    className="h-2"
                  />
                  <p className="text-sm text-gray-500">
                    {state.pet.experience % 100}/100 XP
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Gamification Section */}
        {state.user.preferences.gamificationEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-md bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <Zap className="w-4 h-4 mr-2 text-orange-500" />
                  Focus Streaks
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-4">
                <StreakCounter streak={state.streaks.current} isActive={true} />
                <p className="text-sm text-gray-600 mt-2">Longest: {state.streaks.longest} days</p>
              </CardContent>
            </Card>

            <Card className="shadow-md bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-sm font-medium text-gray-600">
                  <Award className="w-4 h-4 mr-2 text-purple-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap justify-center gap-3 py-4">
                {state.achievements.length > 0 ? (
                  state.achievements.slice(0, 5).map(ach => (
                    <AchievementBadge key={ach.id} achievement={ach} size="sm" />
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No achievements yet. Keep focusing!</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200 card-hover"
            onClick={() => navigate('/tasks')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">My Tasks</h3>
                  <p className="text-sm text-gray-600">
                    Manage and organize your tasks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200 card-hover"
            onClick={() => navigate('/reading')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Reading & Review</h3>
                  <p className="text-sm text-gray-600">
                    Active reading with highlights
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-200 card-hover"
            onClick={() => navigate('/notes')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <PenTool className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Note-Taking</h3>
                  <p className="text-sm text-gray-600">
                    Smart notes and summaries
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-200 card-hover"
            onClick={() => navigate('/settings')}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Settings</h3>
                  <p className="text-sm text-gray-600">
                    Customize your experience
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Encouraging Message */}
        <Card className="shadow-md bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 card-hover">
          <CardContent className="p-6 text-center">
            <Brain className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
            <p className="text-gray-700 font-medium">
              "Every small step forward is progress worth celebrating. You've got this! 🌟"
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


