import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BookOpen,
  Highlighter,
  FileText,
  Eye,
  Search,
  Lightbulb,
  Download,
  Upload,
  Sparkles,
  Brain,
  Target,
  List,
  ArrowLeft
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ReadingReview = () => {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const [processedText, setProcessedText] = useState('')
  const [highlights, setHighlights] = useState([])
  const [questions, setQuestions] = useState([])
  const [summary, setSummary] = useState('')
  const [keyTerms, setKeyTerms] = useState([])
  const [activeMode, setActiveMode] = useState('input')
  const fileInputRef = useRef(null)

  // Simulate text processing functions (in a real app, these would call AI APIs)
  const processText = (text, mode = 'full') => {
    if (!text.trim()) return

    setProcessedText(text)
    
    if (mode === 'full') {
      // Generate key terms
      const terms = extractKeyTerms(text)
      setKeyTerms(terms)
      
      // Generate questions
      const generatedQuestions = generateQuestions(text)
      setQuestions(generatedQuestions)
      
      // Generate summary
      const textSummary = generateSummary(text)
      setSummary(textSummary)
    } else if (mode === 'skim') {
      // Extract only key terms and main ideas for skimming
      const terms = extractKeyTerms(text)
      setKeyTerms(terms)
      
      const mainIdeas = extractMainIdeas(text)
      setSummary(mainIdeas)
    }
    
    setActiveMode('review')
  }

  const extractKeyTerms = (text) => {
    // Simple keyword extraction (in real app, use NLP)
    const words = text.toLowerCase().split(/\W+/)
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those']
    
    const wordFreq = {}
    words.forEach(word => {
      if (word.length > 3 && !commonWords.includes(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })
    
    return Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, freq]) => ({ term: word, frequency: freq }))
  }

  const generateQuestions = (text) => {
    // Simple question generation based on text patterns
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const questions = []
    
    sentences.slice(0, 5).forEach((sentence, index) => {
      if (sentence.includes('because') || sentence.includes('due to')) {
        questions.push(`Why ${sentence.split(/because|due to/)[0].trim().toLowerCase()}?`)
      } else if (sentence.includes('when') || sentence.includes('during')) {
        questions.push(`When did ${sentence.toLowerCase().replace(/when|during/, '').trim()}?`)
      } else {
        questions.push(`What is the main point of: "${sentence.trim().substring(0, 50)}..."?`)
      }
    })
    
    return questions
  }

  const generateSummary = (text) => {
    // Simple summary generation (first and key sentences)
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    if (sentences.length <= 3) return text
    
    const summary = [
      sentences[0], // First sentence
      sentences[Math.floor(sentences.length / 2)], // Middle sentence
      sentences[sentences.length - 1] // Last sentence
    ].join('. ') + '.'
    
    return summary
  }

  const extractMainIdeas = (text) => {
    // Extract main ideas for skimming mode
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const mainIdeas = sentences
      .filter(sentence => 
        sentence.includes('important') || 
        sentence.includes('key') || 
        sentence.includes('main') ||
        sentence.includes('significant') ||
        sentence.length > 50
      )
      .slice(0, 3)
      .join('. ') + '.'
    
    return mainIdeas || sentences.slice(0, 2).join('. ') + '.'
  }

  const highlightText = (text, term) => {
    if (!term) return text
    const regex = new RegExp(`(${term})`, 'gi')
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/plain') {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInputText(e.target.result)
      }
      reader.readAsText(file)
    }
  }

  const exportNotes = () => {
    const notes = {
      originalText: inputText,
      summary: summary,
      keyTerms: keyTerms,
      questions: questions,
      timestamp: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'reading-notes.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-6xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-800">Reading & Review</h1>
          </div>
          
          {processedText && (
            <Button
              variant="outline"
              onClick={exportNotes}
              className="btn-animated"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Notes
            </Button>
          )}
        </div>

        {activeMode === 'input' && (
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <span>Input Study Material</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-animated"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Text File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your study material here (text, notes, article content, etc.)..."
                rows={12}
                className="w-full"
              />
              
              <div className="flex space-x-4">
                <Button
                  onClick={() => processText(inputText, 'full')}
                  disabled={!inputText.trim()}
                  className="bg-blue-600 hover:bg-blue-700 btn-animated"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Full Analysis
                </Button>
                
                <Button
                  onClick={() => processText(inputText, 'skim')}
                  disabled={!inputText.trim()}
                  variant="outline"
                  className="btn-animated"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Skim Mode
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeMode === 'review' && (
          <div className="space-y-6">
            {/* Mode Switch */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setActiveMode('input')}
                className="btn-animated"
              >
                <FileText className="w-4 h-4 mr-2" />
                New Material
              </Button>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="highlight">Highlight</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="terms">Key Terms</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="card-hover">
                    <CardContent className="p-4 text-center">
                      <Lightbulb className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                      <div className="text-2xl font-bold text-gray-800">{questions.length}</div>
                      <p className="text-sm text-gray-600">Questions Generated</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-hover">
                    <CardContent className="p-4 text-center">
                      <Target className="w-8 h-8 mx-auto text-green-500 mb-2" />
                      <div className="text-2xl font-bold text-gray-800">{keyTerms.length}</div>
                      <p className="text-sm text-gray-600">Key Terms Found</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="card-hover">
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                      <div className="text-2xl font-bold text-gray-800">{Math.round(processedText.length / 100)}</div>
                      <p className="text-sm text-gray-600">Text Complexity</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle>Quick Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="highlight" className="space-y-4">
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Highlighter className="w-5 h-5 text-yellow-600" />
                      <span>Interactive Text Highlighting</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {keyTerms.slice(0, 5).map((term, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const highlighted = highlightText(processedText, term.term)
                            document.getElementById('highlighted-text').innerHTML = highlighted
                          }}
                          className="btn-animated"
                        >
                          {term.term}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          document.getElementById('highlighted-text').innerHTML = processedText
                        }}
                        className="btn-animated"
                      >
                        Clear Highlights
                      </Button>
                    </div>
                    
                    <div 
                      id="highlighted-text"
                      className="p-4 bg-gray-50 rounded-lg border max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: processedText }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="space-y-4">
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <span>Generated Questions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-start space-x-3">
                            <Badge variant="outline" className="mt-1">Q{index + 1}</Badge>
                            <p className="text-gray-800 flex-1">{question}</p>
                          </div>
                          <div className="mt-3">
                            <Textarea
                              placeholder="Write your answer here..."
                              rows={3}
                              className="w-full"
                            />
                          </div>
                        </div>
                      ))}
                      
                      {questions.length === 0 && (
                        <p className="text-gray-500 text-center py-8">
                          No questions generated. Try processing text with more content.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="terms" className="space-y-4">
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="w-5 h-5 text-green-600" />
                      <span>Key Terms & Definitions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {keyTerms.map((term, index) => (
                        <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800 capitalize">{term.term}</h4>
                            <Badge variant="outline">{term.frequency}x</Badge>
                          </div>
                          <Textarea
                            placeholder="Add your definition or notes..."
                            rows={2}
                            className="w-full text-sm"
                          />
                        </div>
                      ))}
                      
                      {keyTerms.length === 0 && (
                        <p className="text-gray-500 text-center py-8 col-span-2">
                          No key terms extracted. Try processing text with more content.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <Card className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <List className="w-5 h-5 text-purple-600" />
                      <span>Generated Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-gray-800 leading-relaxed">{summary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Your Notes & Reflections</h4>
                      <Textarea
                        placeholder="Add your own thoughts, connections, or additional notes..."
                        rows={6}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button className="bg-purple-600 hover:bg-purple-700 btn-animated">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Flashcards
                      </Button>
                      <Button variant="outline" className="btn-animated">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Quiz
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReadingReview

