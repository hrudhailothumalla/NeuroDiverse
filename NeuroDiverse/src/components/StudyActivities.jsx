import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Edit3, 
  RotateCcw, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Brain,
  BookOpen,
  Calculator,
  Code,
  Palette,
  FileText,
  Lightbulb,
  Target,
  Shuffle
} from 'lucide-react'

// Flashcard Study Activity
const FlashcardActivity = ({ task, onProgress }) => {
  const [cards, setCards] = useState([
    { id: 1, front: 'Sample Question', back: 'Sample Answer', mastered: false }
  ])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newFront, setNewFront] = useState('')
  const [newBack, setNewBack] = useState('')

  const currentCard = cards[currentCardIndex]
  const masteredCount = cards.filter(card => card.mastered).length

  const addCard = () => {
    if (newFront.trim() && newBack.trim()) {
      setCards([...cards, {
        id: Date.now(),
        front: newFront,
        back: newBack,
        mastered: false
      }])
      setNewFront('')
      setNewBack('')
      setIsEditing(false)
    }
  }

  const markMastered = (mastered) => {
    const updatedCards = cards.map(card => 
      card.id === currentCard.id ? { ...card, mastered } : card
    )
    setCards(updatedCards)
    setShowAnswer(false)
    
    // Move to next card
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    } else {
      setCurrentCardIndex(0)
    }
    
    onProgress(updatedCards.filter(c => c.mastered).length / updatedCards.length * 100)
  }

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentCardIndex(0)
    setShowAnswer(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="font-medium">Flashcard Study</span>
          <Badge variant="outline">{masteredCount}/{cards.length} mastered</Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={shuffleCards}>
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add New Flashcard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Front (Question)</label>
              <Input
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                placeholder="Enter the question or term..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Back (Answer)</label>
              <Textarea
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                placeholder="Enter the answer or definition..."
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={addCard} className="flex-1">Add Card</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="min-h-[300px]">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-sm text-gray-500">
                Card {currentCardIndex + 1} of {cards.length}
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-lg min-h-[200px] flex items-center justify-center">
                <div className="text-center">
                  {!showAnswer ? (
                    <div>
                      <h3 className="text-xl font-semibold mb-4">{currentCard.front}</h3>
                      <Button onClick={() => setShowAnswer(true)}>
                        Show Answer
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg text-gray-600 mb-2">{currentCard.front}</h3>
                      <div className="border-t pt-4">
                        <p className="text-xl font-semibold">{currentCard.back}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {showAnswer && (
                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => markMastered(false)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Need Practice
                  </Button>
                  <Button
                    onClick={() => markMastered(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Got It!
                  </Button>
                </div>
              )}

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentCardIndex(Math.max(0, currentCardIndex - 1))
                    setShowAnswer(false)
                  }}
                  disabled={currentCardIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentCardIndex(Math.min(cards.length - 1, currentCardIndex + 1))
                    setShowAnswer(false)
                  }}
                  disabled={currentCardIndex === cards.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Note-taking Activity
const NoteTakingActivity = ({ task, onProgress }) => {
  const [notes, setNotes] = useState('')
  const [keyPoints, setKeyPoints] = useState([])
  const [newKeyPoint, setNewKeyPoint] = useState('')

  const addKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setKeyPoints([...keyPoints, { id: Date.now(), text: newKeyPoint, completed: false }])
      setNewKeyPoint('')
      onProgress(Math.min(100, (notes.length / 500 + keyPoints.length / 5) * 50))
    }
  }

  const toggleKeyPoint = (id) => {
    setKeyPoints(keyPoints.map(point => 
      point.id === id ? { ...point, completed: !point.completed } : point
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <FileText className="w-5 h-5 text-blue-600" />
        <span className="font-medium">Note Taking</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Main Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value)
                onProgress(Math.min(100, (e.target.value.length / 500) * 100))
              }}
              placeholder="Take your notes here..."
              rows={12}
              className="w-full"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input
                value={newKeyPoint}
                onChange={(e) => setNewKeyPoint(e.target.value)}
                placeholder="Add a key point..."
                onKeyPress={(e) => e.key === 'Enter' && addKeyPoint()}
              />
              <Button onClick={addKeyPoint} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {keyPoints.map(point => (
                <div key={point.id} className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleKeyPoint(point.id)}
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      point.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}
                  >
                    {point.completed && <Check className="w-3 h-3 text-white" />}
                  </button>
                  <span className={point.completed ? 'line-through text-gray-500' : ''}>
                    {point.text}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Math Problem Practice Activity
const MathPracticeActivity = ({ task, onProgress }) => {
  const [problems, setProblems] = useState([
    { id: 1, question: 'Sample problem: 2x + 5 = 13', answer: '', solution: 'x = 4', solved: false }
  ])
  const [currentProblem, setCurrentProblem] = useState(0)
  const [showSolution, setShowSolution] = useState(false)

  const addProblem = () => {
    const newProblem = {
      id: Date.now(),
      question: 'New problem...',
      answer: '',
      solution: 'Solution...',
      solved: false
    }
    setProblems([...problems, newProblem])
  }

  const updateAnswer = (answer) => {
    const updated = problems.map(p => 
      p.id === problems[currentProblem].id ? { ...p, answer } : p
    )
    setProblems(updated)
  }

  const markSolved = () => {
    const updated = problems.map(p => 
      p.id === problems[currentProblem].id ? { ...p, solved: true } : p
    )
    setProblems(updated)
    onProgress(updated.filter(p => p.solved).length / updated.length * 100)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-green-600" />
          <span className="font-medium">Math Practice</span>
          <Badge variant="outline">
            {problems.filter(p => p.solved).length}/{problems.length} solved
          </Badge>
        </div>
        <Button variant="outline" size="sm" onClick={addProblem}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="text-sm text-gray-500">
              Problem {currentProblem + 1} of {problems.length}
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                {problems[currentProblem].question}
              </h3>
              
              <div className="space-y-4">
                <Input
                  value={problems[currentProblem].answer}
                  onChange={(e) => updateAnswer(e.target.value)}
                  placeholder="Your answer..."
                  className="text-center text-lg"
                />
                
                {showSolution && (
                  <div className="border-t pt-4">
                    <p className="text-green-700 font-medium">
                      Solution: {problems[currentProblem].solution}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? 'Hide' : 'Show'} Solution
              </Button>
              <Button onClick={markSolved} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-2" />
                Mark Solved
              </Button>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentProblem(Math.max(0, currentProblem - 1))}
                disabled={currentProblem === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentProblem(Math.min(problems.length - 1, currentProblem + 1))}
                disabled={currentProblem === problems.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Code Practice Activity
const CodePracticeActivity = ({ task, onProgress }) => {
  const [code, setCode] = useState('// Write your code here...\n\n')
  const [testCases, setTestCases] = useState([
    { input: 'Test input', expected: 'Expected output', passed: false }
  ])
  const [currentStep, setCurrentStep] = useState('planning') // planning, coding, testing

  const steps = [
    { id: 'planning', name: 'Plan Algorithm', icon: Lightbulb },
    { id: 'coding', name: 'Write Code', icon: Code },
    { id: 'testing', name: 'Test & Debug', icon: Target }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Code className="w-5 h-5 text-indigo-600" />
        <span className="font-medium">Code Practice</span>
      </div>

      <div className="flex space-x-2 mb-4">
        {steps.map(step => (
          <Button
            key={step.id}
            variant={currentStep === step.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentStep(step.id)}
            className="flex items-center space-x-2"
          >
            <step.icon className="w-4 h-4" />
            <span>{step.name}</span>
          </Button>
        ))}
      </div>

      {currentStep === 'planning' && (
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Planning</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Plan your approach, write pseudocode, or outline the steps..."
              rows={8}
            />
          </CardContent>
        </Card>
      )}

      {currentStep === 'coding' && (
        <Card>
          <CardHeader>
            <CardTitle>Code Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                onProgress(Math.min(100, e.target.value.length / 200 * 100))
              }}
              placeholder="Write your code here..."
              rows={12}
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>
      )}

      {currentStep === 'testing' && (
        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testCases.map((testCase, index) => (
                <div key={index} className="border p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Input</label>
                      <Input value={testCase.input} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Expected Output</label>
                      <Input value={testCase.expected} readOnly />
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant={testCase.passed ? 'default' : 'outline'}
                      onClick={() => {
                        const updated = [...testCases]
                        updated[index].passed = !updated[index].passed
                        setTestCases(updated)
                        onProgress(updated.filter(t => t.passed).length / updated.length * 100)
                      }}
                    >
                      {testCase.passed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      {testCase.passed ? 'Passed' : 'Failed'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Generic Reading Activity
const ReadingActivity = ({ task, onProgress }) => {
  const [readingProgress, setReadingProgress] = useState(0)
  const [notes, setNotes] = useState('')
  const [questions, setQuestions] = useState([])
  const [newQuestion, setNewQuestion] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <span className="font-medium">Active Reading</span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reading Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Progress: {readingProgress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={readingProgress}
                onChange={(e) => {
                  setReadingProgress(e.target.value)
                  onProgress(e.target.value)
                }}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Reading Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes as you read..."
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Questions & Reflections</label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="What questions do you have?"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && newQuestion.trim()) {
                      setQuestions([...questions, newQuestion])
                      setNewQuestion('')
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    if (newQuestion.trim()) {
                      setQuestions([...questions, newQuestion])
                      setNewQuestion('')
                    }
                  }}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    {question}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Study Activity Component
const StudyActivity = ({ task, onProgress }) => {
  if (!task) return null

  switch (task.category) {
    case 'memorization':
      return <FlashcardActivity task={task} onProgress={onProgress} />
    case 'note-taking':
      return <NoteTakingActivity task={task} onProgress={onProgress} />
    case 'math-science':
      return <MathPracticeActivity task={task} onProgress={onProgress} />
    case 'coding':
      return <CodePracticeActivity task={task} onProgress={onProgress} />
    default:
      return <ReadingActivity task={task} onProgress={onProgress} />
  }
}

export default StudyActivity

