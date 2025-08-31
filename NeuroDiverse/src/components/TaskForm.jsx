import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { TASK_CATEGORIES, FOCUS_MODES } from '../constants/taskCategories';
import TaskCategorySelector from './TaskCategorySelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, ChevronDown, X, Tag, Flag } from 'lucide-react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';

export default function TaskForm({ task = null, onSave, onCancel }) {
  const { state } = useApp();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate) : null);
  const [category, setCategory] = useState(task?.category || null);
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState('');

  // Initialize form with task data if editing
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setCategory(task.category || null);
      setPriority(task.priority || 'medium');
      
      if (task.dueDate) {
        const date = new Date(task.dueDate);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        setTime(`${hours}:${minutes}`);
      }
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    try {
      // Combine date and time if both are provided
      let combinedDueDate = null;
      if (dueDate) {
        combinedDueDate = new Date(dueDate);
        
        if (time) {
          const [hours, minutes] = time.split(':').map(Number);
          combinedDueDate.setHours(hours, minutes, 0, 0);
        } else {
          // Default to end of day if no time is provided
          combinedDueDate.setHours(23, 59, 59, 999);
        }
      }

      const taskData = {
        id: task?.id || Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        dueDate: combinedDueDate,
        category,
        priority,
        completed: task?.completed || false,
        createdAt: task?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        focusMode: category ? TASK_CATEGORIES.find(c => c.id === category)?.focusMode : 'standard',
      };

      await onSave(taskData);
      
      // Reset form if it's not an edit
      if (!task) {
        setTitle('');
        setDescription('');
        setDueDate(null);
        setCategory(null);
        setPriority('medium');
        setTime('');
      }
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    
    return format(date, 'MMM d, yyyy');
  };

  const quickDateOptions = [
    { label: 'Today', value: 'today', date: new Date() },
    { label: 'Tomorrow', value: 'tomorrow', date: addDays(new Date(), 1) },
    { label: 'Next Week', value: 'nextWeek', date: addDays(new Date(), 7) },
  ];

  const priorityOptions = [
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  ];

  const selectedCategory = TASK_CATEGORIES.find(cat => cat.id === category);
  const selectedPriority = priorityOptions.find(p => p.value === priority);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium py-5 px-4"
          autoFocus
        />
      </div>

      <div>
        <Textarea
          placeholder="Add description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <TaskCategorySelector
            value={category}
            onChange={(categoryId) => setCategory(categoryId)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Due Date
          </label>
          <div className="flex space-x-2">
            <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                  {dueDate ? formatDate(dueDate) : 'No date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="p-2 border-b">
                  <div className="grid grid-cols-3 gap-1">
                    {quickDateOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant="ghost"
                        className="text-xs h-8"
                        onClick={() => {
                          setDueDate(option.date);
                          setShowDatePicker(false);
                        }}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    setDueDate(date);
                    setShowDatePicker(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover open={showTimePicker} onOpenChange={setShowTimePicker}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-[120px] justify-start text-left font-normal"
                >
                  <Clock className="mr-2 h-4 w-4 opacity-50" />
                  {time || 'No time'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full"
                />
              </PopoverContent>
            </Popover>

            {dueDate && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setDueDate(null);
                  setTime('');
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <div className="flex space-x-2">
            {priorityOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={priority === option.value ? 'default' : 'outline'}
                className={`${priority === option.value ? option.color : ''} flex-1`}
                onClick={() => setPriority(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {selectedCategory && (
        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${selectedCategory.color} bg-opacity-20`}>
              <span className="text-xl">{selectedCategory.icon}</span>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedCategory.name} Task
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Recommended focus mode: <span className="font-medium">
                  {FOCUS_MODES[selectedCategory.focusMode]?.name || 'Standard'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim() || isSubmitting}>
          {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
}
