import { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

// Initial state
const initialState = {
  user: {
    preferences: {
      theme: 'light', // light, dark, high-contrast
      gamificationEnabled: true,
      taskStyle: 'chunked', // chunked, simple
      focusTimerPreference: 'adaptive', // adaptive, standard
      sensoryMode: 'light'
    }
  },
  tasks: [],
  currentSession: null,
  sessionHistory: [],
  pet: {
    level: 1,
    experience: 0,
    happiness: 100,
    name: 'Buddy'
  },
  badges: [],
  streaks: {
    current: 0,
    longest: 0,
    lastSessionDate: null
  },
  achievements: [],
  stats: {
    totalFocusTime: 0,
    tasksCompleted: 0,
    sessionsCompleted: 0,
    perfectDays: 0
  }
}

// Achievement definitions
const ACHIEVEMENTS = [
  { id: 'first_task', name: 'Getting Started', description: 'Complete your first task', icon: '🎯', requirement: 'tasks_completed', threshold: 1 },
  { id: 'task_master', name: 'Task Master', description: 'Complete 10 tasks', icon: '🏆', requirement: 'tasks_completed', threshold: 10 },
  { id: 'focus_warrior', name: 'Focus Warrior', description: 'Complete 5 focus sessions', icon: '⚔️', requirement: 'sessions_completed', threshold: 5 },
  { id: 'streak_starter', name: 'Streak Starter', description: 'Maintain a 3-day focus streak', icon: '🔥', requirement: 'streak', threshold: 3 },
  { id: 'consistency_king', name: 'Consistency King', description: 'Maintain a 7-day focus streak', icon: '👑', requirement: 'streak', threshold: 7 },
  { id: 'deep_focus', name: 'Deep Focus', description: 'Complete a 45+ minute session', icon: '🧠', requirement: 'long_session', threshold: 45 },
  { id: 'early_bird', name: 'Early Bird', description: 'Complete a session before 9 AM', icon: '🌅', requirement: 'early_session', threshold: 1 },
  { id: 'night_owl', name: 'Night Owl', description: 'Complete a session after 9 PM', icon: '🦉', requirement: 'late_session', threshold: 1 },
  { id: 'pet_lover', name: 'Pet Lover', description: 'Reach pet level 5', icon: '💜', requirement: 'pet_level', threshold: 5 },
  { id: 'marathon_runner', name: 'Marathon Runner', description: 'Accumulate 10 hours of focus time', icon: '🏃‍♂️', requirement: 'total_focus_time', threshold: 600 }
]

// Action types
const actionTypes = {
  SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  COMPLETE_TASK: 'COMPLETE_TASK',
  START_SESSION: 'START_SESSION',
  END_SESSION: 'END_SESSION',
  UPDATE_PET: 'UPDATE_PET',
  ADD_BADGE: 'ADD_BADGE',
  UPDATE_STREAK: 'UPDATE_STREAK',
  ADD_ACHIEVEMENT: 'ADD_ACHIEVEMENT',
  UPDATE_STATS: 'UPDATE_STATS',
  LOAD_STATE: 'LOAD_STATE',
  SAVE_STATE: 'SAVE_STATE',
  INCREMENT_DAILY_TASKS: 'INCREMENT_DAILY_TASKS',
  RESET_DAILY_TASKS: 'RESET_DAILY_TASKS',
  ADD_EXPERIENCE: 'ADD_EXPERIENCE',
  LEVEL_UP_PET: 'LEVEL_UP_PET'
}

// Helper functions
const getExperienceToNextLevel = (level) => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

function checkAchievements(state, newStats) {
  const newAchievements = [];
  
  ACHIEVEMENTS.forEach(achievement => {
    // Skip if already earned
    if (state.achievements.some(a => a.id === achievement.id)) return;
    
    let earned = false;
    switch (achievement.requirement) {
      case 'tasks_completed':
        earned = newStats.tasksCompleted >= achievement.threshold;
        break;
      case 'sessions_completed':
        earned = newStats.sessionsCompleted >= achievement.threshold;
        break;
      case 'streak':
        earned = state.streaks.current >= achievement.threshold;
        break;
      case 'pet_level':
        earned = state.pet.level >= achievement.threshold;
        break;
      case 'total_focus_time':
        earned = newStats.totalFocusTime >= achievement.threshold;
        break;
      case 'long_session':
      case 'early_session':
      case 'late_session':
        // These are checked during session end
        break
    }
    
    if (earned) {
      newAchievements.push({
        ...achievement,
        earnedAt: Date.now()
      })
    }
  })
  
  return newAchievements
}

function updateStreak(state, sessionCompleted) {
  const today = new Date().toDateString()
  const lastSessionDate = state.streaks.lastSessionDate
  
  if (!sessionCompleted) {
    return state.streaks
  }
  
  if (!lastSessionDate || lastSessionDate !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const wasYesterday = lastSessionDate === yesterday.toDateString()
    
    return {
      current: wasYesterday ? state.streaks.current + 1 : 1,
      longest: Math.max(state.streaks.longest, wasYesterday ? state.streaks.current + 1 : 1),
      lastSessionDate: today
    }
  }
  
  return state.streaks
}

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.INCREMENT_DAILY_TASKS:
      return {
        ...state,
        stats: {
          ...state.stats,
          dailyTasksCompleted: (state.stats.dailyTasksCompleted || 0) + 1,
          tasksCompleted: (state.stats.tasksCompleted || 0) + 1
        }
      };
      
    case actionTypes.ADD_EXPERIENCE:
      const currentExp = state.pet.experience;
      const currentLevel = state.pet.level;
      const expToNextLevel = getExperienceToNextLevel(currentLevel);
      const newExp = currentExp + action.payload;
      
      if (newExp >= expToNextLevel) {
        // Level up
        return {
          ...state,
          pet: {
            ...state.pet,
            level: currentLevel + 1,
            experience: newExp - expToNextLevel,
            happiness: Math.min(100, state.pet.happiness + 10)
          },
          stats: {
            ...state.stats,
            levelUps: (state.stats.levelUps || 0) + 1
          }
        };
      }
      
      return {
        ...state,
        pet: {
          ...state.pet,
          experience: newExp
        }
      };
      
    case actionTypes.SET_USER_PREFERENCES:
      return {
        ...state,
        user: {
          ...state.user,
          preferences: {
            ...state.user.preferences,
            ...action.payload
          }
        }
      }
      
    case actionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: Date.now(), completed: false, createdAt: Date.now() }]
      }
    
    case actionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        )
      }
    
    case actionTypes.COMPLETE_TASK:
      const completedTask = state.tasks.find(t => t.id === action.payload);
      if (!completedTask) return state;
      
      const updatedTasks = state.tasks.map(task => 
        task.id === action.payload 
          ? { ...task, completed: true, completedAt: new Date().toISOString() }
          : task
      );
      
      const newStats = {
        ...state.stats,
        tasksCompleted: (state.stats.tasksCompleted || 0) + 1,
        dailyTasksCompleted: (state.stats.dailyTasksCompleted || 0) + 1
      };
      
      // Check for achievements
      const newAchievements = checkAchievements(state, newStats);
      
      // Calculate XP based on task difficulty
      const xpReward = completedTask.difficulty === 'hard' ? 30 : 
                      completedTask.difficulty === 'medium' ? 20 : 10;
      
      // Update state with XP and check for level up
      const nextExp = state.pet.experience + xpReward;
      const requiredExp = getExperienceToNextLevel(state.pet.level);
      
      if (nextExp >= requiredExp) {
        // Level up the pet
        return {
          ...state,
          tasks: updatedTasks,
          stats: newStats,
          achievements: [...state.achievements, ...newAchievements],
          pet: {
            ...state.pet,
            level: state.pet.level + 1,
            experience: nextExp - requiredExp,
            happiness: Math.min(100, state.pet.happiness + 5)
          }
        };
      }
      
      return {
        ...state,
        tasks: updatedTasks,
        stats: newStats,
        achievements: [...state.achievements, ...newAchievements],
        pet: {
          ...state.pet,
          experience: currentExp
        }
      };
    
    case actionTypes.START_SESSION:
      return {
        ...state,
        currentSession: {
          startTime: Date.now(),
          task: action.payload.task,
          duration: action.payload.duration,
          type: action.payload.type || 'focus',
          customDuration: action.payload.customDuration
        }
      }
    
    case actionTypes.END_SESSION:
      const session = {
        ...state.currentSession,
        endTime: Date.now(),
        completed: action.payload.completed || false
      }
      
      const sessionDuration = (session.endTime - session.startTime) / 1000 / 60 // minutes
      const sessionHour = new Date(session.startTime).getHours()
      
      // Update stats
      const updatedStats = {
        ...state.stats,
        totalFocusTime: state.stats.totalFocusTime + sessionDuration,
        sessionsCompleted: session.completed ? state.stats.sessionsCompleted + 1 : state.stats.sessionsCompleted
      }
      
      // Update streak
      const updatedStreak = updateStreak(state, session.completed)
      
      // Check for session-specific achievements
      let sessionAchievements = []
      if (session.completed) {
        // Long session achievement
        if (sessionDuration >= 45 && !state.achievements.some(a => a.id === 'long_session')) {
          sessionAchievements.push({
            ...ACHIEVEMENTS.find(a => a.id === 'long_session'),
            earnedAt: Date.now()
          })
        }
        
        // Early bird achievement
        if (sessionHour < 9 && !state.achievements.some(a => a.id === 'early_bird')) {
          sessionAchievements.push({
            ...ACHIEVEMENTS.find(a => a.id === 'early_bird'),
            earnedAt: Date.now()
          })
        }
        
        // Night owl achievement
        if (sessionHour >= 21 && !state.achievements.some(a => a.id === 'night_owl')) {
          sessionAchievements.push({
            ...ACHIEVEMENTS.find(a => a.id === 'night_owl'),
            earnedAt: Date.now()
          })
        }
      }
      
      // Check for other achievements
      const otherAchievements = checkAchievements(state, updatedStats)
      
      return {
        ...state,
        currentSession: null,
        sessionHistory: [...state.sessionHistory, session],
        stats: updatedStats,
        streaks: updatedStreak,
        achievements: [...state.achievements, ...sessionAchievements, ...otherAchievements],
        pet: {
          ...state.pet,
          experience: session.completed ? state.pet.experience + 20 : state.pet.experience,
          happiness: session.completed ? Math.min(100, state.pet.happiness + 10) : Math.max(0, state.pet.happiness - 5)
        }
      }
    
    case actionTypes.UPDATE_PET:
      return {
        ...state,
        pet: { ...state.pet, ...action.payload }
      }
    
    case actionTypes.ADD_BADGE:
      return {
        ...state,
        badges: [...state.badges, action.payload]
      }
    
    case actionTypes.ADD_ACHIEVEMENT:
      return {
        ...state,
        achievements: [...state.achievements, action.payload]
      }
    
    case actionTypes.UPDATE_STATS:
      return {
        ...state,
        stats: { ...state.stats, ...action.payload }
      }
    
    case actionTypes.LOAD_STATE:
      return { ...state, ...action.payload }
    
    default:
      return state
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('appState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Check if we need to reset daily tasks (if it's a new day)
        const lastReset = new Date(parsedState.lastReset || 0);
        const now = new Date();
        const isNewDay = lastReset.getDate() !== now.getDate() || 
                        lastReset.getMonth() !== now.getMonth() || 
                        lastReset.getFullYear() !== now.getFullYear();
        
        if (isNewDay) {
          // Reset daily stats
          parsedState.stats.dailyTasksCompleted = 0;
          parsedState.lastReset = now.toISOString();
          
          // Update streak if user was active yesterday
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastReset.getDate() === yesterday.getDate() && 
              lastReset.getMonth() === yesterday.getMonth() && 
              lastReset.getFullYear() === yesterday.getFullYear()) {
            // Increment streak
            parsedState.streaks.current += 1;
            if (parsedState.streaks.current > parsedState.streaks.longest) {
              parsedState.streaks.longest = parsedState.streaks.current;
            }
          } else if (lastReset.getDate() !== now.getDate()) {
            // Reset streak if not consecutive
            parsedState.streaks.current = 0;
          }
        }
        
        dispatch({ type: actionTypes.LOAD_STATE, payload: parsedState });
      } else {
        // Initialize with today's date
        dispatch({ 
          type: actionTypes.LOAD_STATE, 
          payload: { ...initialState, lastReset: new Date().toISOString() } 
        });
      }
    } catch (error) {
      console.error('Failed to load state:', error);
      // Initialize with default state if loading fails
      dispatch({ 
        type: actionTypes.LOAD_STATE, 
        payload: { ...initialState, lastReset: new Date().toISOString() } 
      });
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state))
  }, [state])

  // Action creators
  const actions = {
    setUserPreferences: (preferences) => 
      dispatch({ type: actionTypes.SET_USER_PREFERENCES, payload: preferences }),
    
    addTask: (task) => 
      dispatch({ type: actionTypes.ADD_TASK, payload: task }),
    
    updateTask: (task) => 
      dispatch({ type: actionTypes.UPDATE_TASK, payload: task }),
    
    completeTask: (taskId) => 
      dispatch({ type: actionTypes.COMPLETE_TASK, payload: taskId }),
    
    startSession: (sessionData) => 
      dispatch({ type: actionTypes.START_SESSION, payload: sessionData }),
    
    endSession: (sessionData) => 
      dispatch({ type: actionTypes.END_SESSION, payload: sessionData }),
    
    updatePet: (petData) => 
      dispatch({ type: actionTypes.UPDATE_PET, payload: petData }),
    
    addBadge: (badge) => 
      dispatch({ type: actionTypes.ADD_BADGE, payload: badge }),
    
    addAchievement: (achievement) => 
      dispatch({ type: actionTypes.ADD_ACHIEVEMENT, payload: achievement }),
    
    updateStats: (stats) => 
      dispatch({ type: actionTypes.UPDATE_STATS, payload: stats })
  }

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export default AppContext

