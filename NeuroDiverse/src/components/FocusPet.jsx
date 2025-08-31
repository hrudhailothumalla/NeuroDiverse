import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useEffect, useState } from 'react';
import { Heart, Zap, Star, Award, Clock } from 'lucide-react';

export default function FocusPet() {
  const { state } = useApp();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [lastLevel, setLastLevel] = useState(1);
  const { pet, stats = {} } = state;
  
  // Check for level up
  useEffect(() => {
    if (pet.level > lastLevel) {
      setShowLevelUp(true);
      setLastLevel(pet.level);
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [pet.level, lastLevel]);

  // Calculate progress to next level
  const expToNextLevel = Math.floor(100 * Math.pow(1.5, pet.level - 1));
  const progress = Math.min(100, (pet.experience / expToNextLevel) * 100);
  
  // Pet evolution stages
  const getPetStage = () => {
    if (pet.level >= 15) return 'dragon';
    if (pet.level >= 10) return 'dragon-egg';
    if (pet.level >= 5) return 'egg-cracked';
    return 'egg';
  };
  
  const petStages = {
    egg: '🥚',
    'egg-cracked': '🥚💥',
    'dragon-egg': '🐉🥚',
    dragon: '🐲'
  };
  
  const currentStage = getPetStage();
  
  return (
    <div className="relative">
      {/* Level Up Animation */}
      {showLevelUp && (
        <motion.div 
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg z-10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="font-bold">Level Up! {pet.level}</span>
          </div>
        </motion.div>
      )}
      
      {/* Pet Display */}
      <motion.div 
        className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="text-8xl mb-4 transform hover:scale-110 transition-transform">
          {petStages[currentStage]}
        </div>
        
        {/* Pet Info */}
        <div className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">{pet.name || 'Buddy'}</h3>
            <div className="flex items-center gap-2 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span>Lv. {pet.level}</span>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>XP: {pet.experience}/{expToNextLevel}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400">Happiness</div>
              <div className="flex items-center justify-center gap-1">
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <span className="font-medium">{pet.happiness || 100}</span>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{state.streaks?.current || 0}d</span>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
              <div className="text-xs text-gray-500 dark:text-gray-400">Tasks</div>
              <div className="flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{stats.tasksCompleted || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Pet Actions */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <motion.button 
          className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Pet</span>
          <span>👋</span>
        </motion.button>
        <motion.button 
          className="flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Feed</span>
          <span>🍎</span>
        </motion.button>
      </div>
    </div>
  );
}
