import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Play,
  Pause,
  Square,
  ArrowLeft,
  Coffee,
  Brain,
  CheckCircle2,
  Timer,
  Sparkles,
  Volume2,
  VolumeX,
  Settings2
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import StudyActivity from './StudyActivities'

export default function FocusSession() {
  const navigate = useNavigate()
  const { state, actions } = useApp()
  const [selectedTask, setSelectedTask] = useState(null)
  const [sessionType, setSessionType] = useState('focus') // 'focus' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60) // Default to 25 minutes
  const [customMinutes, setCustomMinutes] = useState(25) // For custom time input
  const [isRunning, setIsRunning] = useState(false)
  const [sessionStarted, setSessionStarted] = useState(false)
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [activityProgress, setActivityProgress] = useState(0) // Progress for study activity
  const intervalRef = useRef(null)

  const incompleteTasks = state.tasks.filter(task => !task.completed)

  // Adaptive timing based on user preferences and performance
  const getSessionDuration = (type, pomodoroCount) => {
    if (state.user.preferences.focusTimerPreference === 'standard') {
      return type === 'focus' ? 25 * 60 : 5 * 60
    }
    
    // Adaptive timing
    if (type === 'break') {
      return pomodoroCount % 4 === 0 ? 15 * 60 : 5 * 60 // Longer break every 4 pomodoros
    }
    
    // Adaptive focus time based on performance
    if (pomodoroCount === 0) return 20 * 60 // Start with shorter sessions
    if (pomodoroCount < 3) return 25 * 60
    return 30 * 60 // Increase as user builds focus
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
      
      if (timeLeft === 0 && sessionStarted) {
        handleSessionComplete()
      }
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft, sessionStarted])

  // Set initial time based on preference or custom input
  useEffect(() => {
    if (!sessionStarted) {
      if (state.user.preferences.focusTimerPreference === 'standard') {
        setTimeLeft(25 * 60)
        setCustomMinutes(25)
      } else {
        setTimeLeft(customMinutes * 60)
      }
    }
  }, [state.user.preferences.focusTimerPreference, customMinutes, sessionStarted])

  const handleSessionComplete = () => {
    // Play completion sound
    if (soundEnabled) {
      playCompletionSound()
    }

    if (sessionType === 'focus') {
      setCompletedPomodoros(prev => prev + 1)
      
      // End current session
      actions.endSession({ completed: true, duration: (customMinutes * 60) - timeLeft })
      
      // Show break suggestion
      const breakDuration = getSessionDuration('break', completedPomodoros + 1)
      setTimeLeft(breakDuration)
      setSessionType('break')
      setIsRunning(false)
      
      // Update pet if gamification is enabled
      if (state.user.preferences.gamificationEnabled) {
        actions.updatePet({ experience: state.pet.experience + 15 })
      }
    } else {
      // Break completed, ready for next focus session
      const focusDuration = getSessionDuration('focus', completedPomodoros)
      setTimeLeft(focusDuration)
      setCustomMinutes(focusDuration / 60)
      setSessionType('focus')
      setIsRunning(false)
    }
  }

  const playCompletionSound = () => {
    // Create a gentle chime sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  const startSession = () => {
    if (!sessionStarted && selectedTask) {
      actions.startSession({
        task: selectedTask,
        duration: timeLeft,
        type: sessionType,
        customDuration: customMinutes
      })
      setSessionStarted(true)
    }
    setIsRunning(true)
  }

  const pauseSession = () => {
    setIsRunning(false)
  }

  const stopSession = () => {
    setIsRunning(false)
    setSessionStarted(false)
    
    if (state.currentSession) {
      actions.endSession({ completed: false })
    }
    
    navigate('/summary')
  }

  const completeTask = (taskId) => {
    actions.completeTask(taskId)
    // Trigger celebration - confetti animation will be handled in SessionSummary
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercentage = () => {
    const totalDuration = sessionStarted ? (state.currentSession?.duration || (customMinutes * 60)) : (customMinutes * 60)
    return ((totalDuration - timeLeft) / totalDuration) * 100
  }

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="btn-animated"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-sm">
              Session {completedPomodoros + 1}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Task Selection */}
        {!sessionStarted && (
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="w-5 h-5 mr-2 text-purple-600" />
                Choose Your Focus Task
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {incompleteTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No tasks available. Add some tasks first!</p>
                  <Button onClick={() => navigate('/tasks')} className="btn-animated">
                    Add Tasks
                  </Button>
                </div>
              ) : (
                incompleteTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all card-hover ${
                      selectedTask?.id === task.id
                        ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTask(task)}
                  >
                    <span className="text-2xl">{task.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-gray-600">{task.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        completeTask(task.id)
                      }}
                      className="hover:bg-green-100"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {/* Timer Display */}
        <Card className="card-hover border-2 border-purple-200">
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              {/* Session Type Badge */}
              <Badge 
                variant={sessionType === 'focus' ? 'default' : 'secondary'}
                className="text-lg px-4 py-2"
              >
                {sessionType === 'focus' ? (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Focus Time
                  </>
                ) : (
                  <>
                    <Coffee className="w-5 h-5 mr-2" />
                    Break Time
                  </>
                )}
              </Badge>

              {/* Current Task */}
              {selectedTask && (
                <div className="flex items-center justify-center space-x-3 text-gray-700">
                  <span className="text-2xl">{selectedTask.icon}</span>
                  <span className="font-medium">{selectedTask.title}</span>
                </div>
              )}

              {/* Timer and Custom Time Input */}
              <div className="relative">
                <div className="text-6xl font-mono font-bold text-gray-800 mb-4">
                  {formatTime(timeLeft)}
                </div>
                
                {!sessionStarted && state.user.preferences.focusTimerPreference !== 'standard' && (
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Settings2 className="w-5 h-5 text-gray-500" />
                    <Input
                      type="number"
                      value={customMinutes}
                      onChange={(e) => {
                        const minutes = parseInt(e.target.value)
                        if (!isNaN(minutes) && minutes > 0) {
                          setCustomMinutes(minutes)
                          setTimeLeft(minutes * 60)
                        }
                      }}
                      className="w-24 text-center"
                      min="1"
                    />
                    <span className="text-gray-600">minutes</span>
                  </div>
                )}

                {/* Animated Progress Ring */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage() / 100)}`}
                      className={`transition-all duration-1000 ${
                        sessionType === 'focus' ? 'text-purple-500' : 'text-green-500'
                      }`}
                      style={{
                        filter: 'drop-shadow(0 0 6px rgba(147, 51, 234, 0.3))'
                      }}
                    />
                  </svg>
                  
                  {/* Center Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {sessionType === 'focus' ? (
                      <Brain className="w-12 h-12 text-purple-500 animate-pulse" />
                    ) : (
                      <Coffee className="w-12 h-12 text-green-500 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress 
                  value={progressPercentage()} 
                  className="h-3 mb-6"
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center space-x-4">
                {!isRunning ? (
                  <Button
                    size="lg"
                    onClick={startSession}
                    disabled={!selectedTask && !sessionStarted}
                    className="px-8 py-4 text-lg bg-purple-600 hover:bg-purple-700 btn-animated pulse-glow"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    {sessionStarted ? 'Resume' : 'Start'}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={pauseSession}
                    className="px-8 py-4 text-lg btn-animated"
                  >
                    <Pause className="w-6 h-6 mr-2" />
                    Pause
                  </Button>
                )}
                
                {sessionStarted && (
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={stopSession}
                    className="px-8 py-4 text-lg btn-animated"
                  >
                    <Square className="w-6 h-6 mr-2" />
                    Stop
                  </Button>
                )}
              </div>

              {/* Encouraging Messages */}
              <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-center space-x-2 text-gray-700">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <p className="font-medium">
                    {sessionType === 'focus' 
                      ? "You're doing great! Stay focused on your goal." 
                      : "Time for a well-deserved break. Stretch and breathe!"
                    }
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Study Activity Section */}
        {sessionType === 'focus' && selectedTask && (
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings2 className="w-5 h-5 text-purple-600" />
                <span>Study Activity: {selectedTask.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StudyActivity task={selectedTask} onProgress={setActivityProgress} />
              <Progress value={activityProgress} className="h-2 mt-4" />
              <p className="text-sm text-gray-500 text-right mt-1">Activity Progress: {Math.round(activityProgress)}%</p>
            </CardContent>
          </Card>
        )}

        {/* Session Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-md card-hover">
            <CardContent className="p-4 text-center">
              <Timer className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <div className="text-2xl font-bold text-gray-800">{completedPomodoros}</div>
              <p className="text-sm text-gray-600">Completed Sessions</p>
            </CardContent>
          </Card>

          <Card className="shadow-md card-hover">
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-gray-800">
                {Math.floor((state.stats.totalFocusTime) / 60)}h {Math.round((state.stats.totalFocusTime) % 60)}m
              </div>
              <p className="text-sm text-gray-600">Total Focus Time</p>
            </CardContent>
          </Card>

          {state.user.preferences.gamificationEnabled && (
            <Card className="shadow-md card-hover">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                <div className="text-2xl font-bold text-gray-800">+{state.pet.experience}</div>
                <p className="text-sm text-gray-600">Total XP Earned</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

