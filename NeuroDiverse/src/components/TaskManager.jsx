import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Lightbulb,
  Sparkles,
  BookOpen,
  PenTool,
  Target,
  Trash2,
  Brain,
  Calculator,
  Palette,
  Music,
  Globe,
  Microscope,
  FileText,
  Code,
  Languages,
  Presentation
} from 'lucide-react'
import { useApp } from '../context/AppContext'

// Task categories with descriptive icons and study methods
const TASK_CATEGORIES = {
  'note-taking': {
    name: 'Note Taking & Reading',
    icon: '📝',
    lucideIcon: FileText,
    color: 'bg-blue-100 text-blue-800',
    description: 'Reading, summarizing, and organizing information',
    studyMethods: ['Cornell Notes', 'Mind Maps', 'Outline Method', 'Charting Method']
  },
  'memorization': {
    name: 'Memorization & Flashcards',
    icon: '🧠',
    lucideIcon: Brain,
    color: 'bg-purple-100 text-purple-800',
    description: 'Learning facts, vocabulary, and concepts by heart',
    studyMethods: ['Flashcards', 'Spaced Repetition', 'Memory Palace', 'Mnemonics']
  },
  'math-science': {
    name: 'Math & Science',
    icon: '🔬',
    lucideIcon: Calculator,
    color: 'bg-green-100 text-green-800',
    description: 'Problem solving, calculations, and scientific concepts',
    studyMethods: ['Practice Problems', 'Formula Sheets', 'Lab Reports', 'Concept Maps']
  },
  'writing': {
    name: 'Writing & Essays',
    icon: '✍️',
    lucideIcon: PenTool,
    color: 'bg-orange-100 text-orange-800',
    description: 'Creative writing, essays, and research papers',
    studyMethods: ['Brainstorming', 'Outline Creation', 'Draft Writing', 'Peer Review']
  },
  'languages': {
    name: 'Language Learning',
    icon: '🌍',
    lucideIcon: Languages,
    color: 'bg-teal-100 text-teal-800',
    description: 'Learning new languages and improving communication',
    studyMethods: ['Conversation Practice', 'Grammar Exercises', 'Vocabulary Building', 'Listening Practice']
  },
  'creative': {
    name: 'Creative & Arts',
    icon: '🎨',
    lucideIcon: Palette,
    color: 'bg-pink-100 text-pink-800',
    description: 'Art, music, design, and creative projects',
    studyMethods: ['Sketching Practice', 'Color Theory', 'Composition Studies', 'Technique Practice']
  },
  'presentation': {
    name: 'Presentations & Public Speaking',
    icon: '🎤',
    lucideIcon: Presentation,
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Preparing and delivering presentations',
    studyMethods: ['Slide Creation', 'Speech Practice', 'Q&A Preparation', 'Visual Aids']
  },
  'coding': {
    name: 'Programming & Technology',
    icon: '💻',
    lucideIcon: Code,
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Coding, software development, and tech skills',
    studyMethods: ['Code Practice', 'Algorithm Study', 'Project Building', 'Debug Sessions']
  },
  'research': {
    name: 'Research & Analysis',
    icon: '🔍',
    lucideIcon: Microscope,
    color: 'bg-gray-100 text-gray-800',
    description: 'Gathering information and analyzing data',
    studyMethods: ['Source Collection', 'Data Analysis', 'Literature Review', 'Citation Management']
  },
  'general': {
    name: 'General Study',
    icon: '📚',
    lucideIcon: BookOpen,
    color: 'bg-slate-100 text-slate-800',
    description: 'General learning and study tasks',
    studyMethods: ['Active Reading', 'Summary Writing', 'Question Generation', 'Review Sessions']
  }
}

export default function TaskManager() {
  const navigate = useNavigate()
  const { state, actions } = useApp()
  const [newTask, setNewTask] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [selectedStudyMethod, setSelectedStudyMethod] = useState('')
  const [showChunkingSuggestions, setShowChunkingSuggestions] = useState(false)
  const [chunkingSuggestions, setChunkingSuggestions] = useState([])

  const generateChunkingSuggestions = (taskTitle, category) => {
    const suggestions = []
    const categoryData = TASK_CATEGORIES[category]
    
    // Generate category-specific suggestions
    switch (category) {
      case 'memorization':
        suggestions.push('Create initial flashcards or notes')
        suggestions.push('First review session (active recall)')
        suggestions.push('Second review session (spaced repetition)')
        suggestions.push('Practice test or quiz yourself')
        suggestions.push('Final review and weak areas focus')
        break
        
      case 'writing':
        suggestions.push('Research topic and gather sources')
        suggestions.push('Create outline and structure')
        suggestions.push('Write introduction paragraph')
        suggestions.push('Write main body paragraphs')
        suggestions.push('Write conclusion')
        suggestions.push('Review and edit')
        break
        
      case 'math-science':
        suggestions.push('Review relevant formulas and concepts')
        suggestions.push('Work through example problems')
        suggestions.push('Practice similar problems')
        suggestions.push('Check answers and understand mistakes')
        suggestions.push('Apply to more complex scenarios')
        break
        
      case 'coding':
        suggestions.push('Plan the algorithm or approach')
        suggestions.push('Write pseudocode or outline')
        suggestions.push('Implement basic functionality')
        suggestions.push('Test and debug code')
        suggestions.push('Optimize and refactor')
        break
        
      case 'presentation':
        suggestions.push('Research and gather content')
        suggestions.push('Create presentation outline')
        suggestions.push('Design slides and visuals')
        suggestions.push('Practice delivery and timing')
        suggestions.push('Prepare for questions and feedback')
        break
        
      case 'languages':
        suggestions.push('Learn new vocabulary words')
        suggestions.push('Practice grammar rules')
        suggestions.push('Complete listening exercises')
        suggestions.push('Practice speaking or writing')
        suggestions.push('Review and reinforce learning')
        break
        
      default:
        suggestions.push('Break down the main topic')
        suggestions.push('Gather necessary materials')
        suggestions.push('Study core concepts')
        suggestions.push('Practice or apply knowledge')
        suggestions.push('Review and test understanding')
    }
    
    return suggestions
  }

  const handleSuggestChunks = () => {
    if (newTask.trim()) {
      const suggestions = generateChunkingSuggestions(newTask, selectedCategory)
      setChunkingSuggestions(suggestions)
      setShowChunkingSuggestions(true)
    }
  }

  const handleAddTask = () => {
    if (newTask.trim()) {
      const task = {
        title: newTask,
        description: taskDescription,
        category: selectedCategory,
        studyMethod: selectedStudyMethod,
        icon: TASK_CATEGORIES[selectedCategory].icon,
        color: TASK_CATEGORIES[selectedCategory].color,
        chunks: showChunkingSuggestions ? chunkingSuggestions : []
      }
      
      actions.addTask(task)
      
      // If chunking is enabled, add each chunk as a separate subtask
      if (showChunkingSuggestions && chunkingSuggestions.length > 0) {
        chunkingSuggestions.forEach((chunk, index) => {
          actions.addTask({
            title: chunk,
            description: `Subtask ${index + 1} of: ${newTask}`,
            category: selectedCategory,
            studyMethod: selectedStudyMethod,
            icon: TASK_CATEGORIES[selectedCategory].icon,
            color: TASK_CATEGORIES[selectedCategory].color,
            isSubtask: true,
            parentTask: newTask
          })
        })
      }
      
      // Reset form
      setNewTask('')
      setTaskDescription('')
      setSelectedCategory('general')
      setSelectedStudyMethod('')
      setShowChunkingSuggestions(false)
      setChunkingSuggestions([])
    }
  }

  const handleCompleteTask = (taskId) => {
    actions.completeTask(taskId)
  }

  const handleDeleteTask = (taskId) => {
    // In a real app, you'd want a confirmation dialog
    actions.updateTask({ id: taskId, deleted: true })
  }

  const pendingTasks = state.tasks.filter(task => !task.completed && !task.deleted)
  const completedTasks = state.tasks.filter(task => task.completed && !task.deleted)

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="btn-animated"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
          </div>
        </div>

        {/* Add New Task Card */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-purple-600" />
              <span>Add New Task</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Task Title</label>
              <Input
                placeholder="What would you like to work on?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description (optional)</label>
              <Textarea
                placeholder="Add any additional details..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(TASK_CATEGORIES).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  {TASK_CATEGORIES[selectedCategory].description}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Study Method (optional)</label>
                <Select value={selectedStudyMethod} onValueChange={setSelectedStudyMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a method" />
                  </SelectTrigger>
                  <SelectContent>
                    {TASK_CATEGORIES[selectedCategory].studyMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleSuggestChunks}
              className="w-full btn-animated"
              disabled={!newTask.trim()}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Suggest Task Chunks
            </Button>

            {showChunkingSuggestions && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Suggested Chunks:</span>
                </div>
                <ul className="space-y-2">
                  {chunkingSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Circle className="w-3 h-3 text-yellow-600" />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-yellow-700 mt-2">
                  These will be added as separate tasks to help you focus on one step at a time.
                </p>
              </div>
            )}

            <Button
              onClick={handleAddTask}
              className="w-full bg-purple-600 hover:bg-purple-700 btn-animated"
              disabled={!newTask.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </CardContent>
        </Card>

        {/* Tasks Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* To Do Tasks */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Circle className="w-5 h-5 text-blue-600" />
                <span>To Do ({pendingTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No tasks yet. Add one above to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className="text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{task.icon}</span>
                          <span className="font-medium">{task.title}</span>
                          {task.isSubtask && (
                            <Badge variant="secondary" className="text-xs">
                              Subtask
                            </Badge>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={TASK_CATEGORIES[task.category].color}>
                            {TASK_CATEGORIES[task.category].name}
                          </Badge>
                          {task.studyMethod && (
                            <Badge variant="outline" className="text-xs">
                              {task.studyMethod}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Completed ({completedTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Completed tasks will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg opacity-75"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{task.icon}</span>
                          <span className="font-medium line-through">{task.title}</span>
                          {task.isSubtask && (
                            <Badge variant="secondary" className="text-xs">
                              Subtask
                            </Badge>
                          )}
                        </div>
                        <Badge className={TASK_CATEGORIES[task.category].color}>
                          {TASK_CATEGORIES[task.category].name}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ready to Focus Section */}
        {pendingTasks.length > 0 && (
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 card-hover">
            <CardContent className="text-center py-8">
              <Brain className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to focus?</h3>
              <p className="text-gray-600 mb-4">You have {pendingTasks.length} tasks waiting</p>
              <Button
                onClick={() => navigate('/focus')}
                className="bg-purple-600 hover:bg-purple-700 btn-animated pulse-glow"
              >
                <Target className="w-4 h-4 mr-2" />
                Start Focus Session
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

