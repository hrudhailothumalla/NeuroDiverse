import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TASK_CATEGORIES } from '../constants/taskCategories';
import { Search, X, Check } from 'lucide-react';

export default function TaskCategorySelector({ value, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Initialize with the provided value
  useEffect(() => {
    if (value) {
      const category = TASK_CATEGORIES.find(cat => cat.id === value);
      setSelectedCategory(category || null);
    } else {
      setSelectedCategory(null);
    }
  }, [value]);

  const filteredCategories = TASK_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (category) => {
    setSelectedCategory(category);
    onChange(category.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    setSelectedCategory(null);
    onChange(null);
  };

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
          isOpen ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-900/50' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedCategory ? (
          <div className="flex items-center space-x-2">
            <span className="text-xl">{selectedCategory.icon}</span>
            <div className="text-left">
              <div className="font-medium text-gray-900 dark:text-white">
                {selectedCategory.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {selectedCategory.description}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">Select a category...</span>
        )}
        
        <div className="flex items-center space-x-2">
          {selectedCategory && (
            <button 
              onClick={clearSelection}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100 dark:border-gray-700">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border-0 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent rounded-md text-sm"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-60 overflow-y-auto">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center p-3 cursor-pointer transition-colors ${
                      selectedCategory?.id === category.id
                        ? 'bg-purple-50 dark:bg-purple-900/30'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => handleSelect(category)}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-2xl">
                      {category.icon}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {category.name}
                        </p>
                        {selectedCategory?.id === category.id && (
                          <Check className="w-4 h-4 text-purple-600 dark:text-purple-400 ml-2 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {category.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No categories found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
