import React, { useState, useEffect } from 'react'
import { Sparkles, Trophy, Star } from 'lucide-react'

const AchievementBadge = ({ achievement, isNew = false, size = 'md' }) => {
  const [showAnimation, setShowAnimation] = useState(isNew)

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setShowAnimation(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isNew])

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-xl',
    lg: 'w-20 h-20 text-2xl'
  }

  return (
    <div className={`relative ${showAnimation ? 'achievement-badge' : ''}`}>
      <div className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-gradient-to-br from-yellow-400 to-orange-500 
        flex items-center justify-center 
        shadow-lg 
        ${showAnimation ? 'animate-bounce' : 'hover:scale-110'} 
        transition-transform duration-300
        border-4 border-yellow-300
      `}>
        <span className="text-white font-bold">{achievement.icon}</span>
      </div>
      
      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
        </div>
      )}
      
      <div className="absolute -bottom-1 -right-1">
        <Trophy className="w-4 h-4 text-yellow-600" />
      </div>
    </div>
  )
}

const AchievementToast = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-20 right-4 z-50 achievement-badge">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-xl max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{achievement.icon}</div>
          <div>
            <div className="font-bold">Achievement Unlocked!</div>
            <div className="text-sm">{achievement.name}</div>
            <div className="text-xs opacity-90">{achievement.description}</div>
          </div>
          <Star className="w-6 h-6 text-yellow-300 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

const ProgressRing = ({ progress, size = 120, strokeWidth = 8, color = '#8b5cf6' }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative">
      <svg
        className="progress-ring transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-circle"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold text-gray-700">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

const StreakCounter = ({ streak, isActive = true }) => {
  return (
    <div className={`flex items-center space-x-2 ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
      <div className={`text-2xl ${isActive ? 'streak-flame' : ''}`}>🔥</div>
      <div>
        <div className="font-bold text-lg">{streak}</div>
        <div className="text-xs">day streak</div>
      </div>
    </div>
  )
}

export { AchievementBadge, AchievementToast, ProgressRing, StreakCounter }
export default AchievementBadge

