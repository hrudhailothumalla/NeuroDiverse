import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  PenTool,
  FileText,
  GitBranch,
  Table,
  CreditCard,
  Download,
  Upload,
  Sparkles,
  Brain,
  List,
  ArrowLeft,
  Plus,
  Minus,
  Edit3,
  Save,
  Trash2
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NoteTaking = () => {
  const navigate = useNavigate()
  const [notes, setNotes] = useState('')
  const [title, setTitle] = useState('')
  const [outline, setOutline] = useState([])
  const [mindMap, setMindMap] = useState({ central: '', branches: [] })
  const [flashcards, setFlashcards] = useState([])
  const [summary, setSummary] = useState('')
  const [activeTab, setActiveTab] = useState('notes')
  const [savedNotes, setSavedNotes] = useState([])

  // Note processing functions
  const generateOutline = (text) => {
    if (!text.trim()) return

    const lines = text.split('\n').filter(line => line.trim())
    const outline = []
    let currentSection = null

    lines.forEach(line => {
      const trimmed = line.trim()
      
      // Check if it's a header (starts with #, *, or is all caps)
      if (trimmed.startsWith('#') || trimmed.startsWith('*') || 
          (trimmed === trimmed.toUpperCase() && trimmed.length > 3)) {
        currentSection = {
          title: trimmed.replace(/^[#*\s]+/, ''),
          points: []
        }
        outline.push(currentSection)
      } else if (currentSection && trimmed.length > 10) {
        currentSection.points.push(trimmed)
      } else if (!currentSection && trimmed.length > 10) {
        // Create a default section if no headers found
        if (outline.length === 0) {
          outline.push({ title: 'Main Points', points: [] })
          currentSection = outline[0]
        }
        currentSection.points.push(trimmed)
      }
    })

    setOutline(outline)
  }

  const generateMindMap = (text) => {
    if (!text.trim()) return

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    const central = title || 'Main Topic'
    const branches = []

    // Extract key concepts for branches
    const keyPhrases = extractKeyPhrases(text)
    keyPhrases.slice(0, 6).forEach(phrase => {
      const relatedSentences = sentences.filter(s => 
        s.toLowerCase().includes(phrase.toLowerCase())
      ).slice(0, 2)
      
      branches.push({
        id: Date.now() + Math.random(),
        title: phrase,
        subtopics: relatedSentences.map(s => s.trim().substring(0, 50) + '...')
      })
    })

    setMindMap({ central, branches })
  }

  const generateFlashcards = (text) => {
    if (!text.trim()) return

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 15)
    const cards = []

    sentences.forEach((sentence, index) => {
      if (sentence.includes('is') || sentence.includes('are') || sentence.includes('means')) {
        // Definition-style cards
        const parts = sentence.split(/\s+is\s+|\s+are\s+|\s+means\s+/)
        if (parts.length >= 2) {
          cards.push({
            id: Date.now() + index,
            front: `What ${parts[0].trim()}?`,
            back: parts[1].trim(),
            type: 'definition'
          })
        }
      } else if (sentence.includes('because') || sentence.includes('due to')) {
        // Cause-effect cards
        const parts = sentence.split(/\s+because\s+|\s+due to\s+/)
        if (parts.length >= 2) {
          cards.push({
            id: Date.now() + index,
            front: `Why ${parts[0].trim()}?`,
            back: `Because ${parts[1].trim()}`,
            type: 'cause-effect'
          })
        }
      } else if (index < 5) {
        // General comprehension cards
        cards.push({
          id: Date.now() + index,
          front: `Explain: ${sentence.trim().substring(0, 40)}...`,
          back: sentence.trim(),
          type: 'comprehension'
        })
      }
    })

    setFlashcards(cards.slice(0, 10)) // Limit to 10 cards
  }

  const generateSummary = (text) => {
    if (!text.trim()) return

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10)
    
    if (sentences.length <= 3) {
      setSummary(text)
      return
    }

    // Extract key sentences based on position and keywords
    const keySentences = []
    
    // First sentence
    keySentences.push(sentences[0])
    
    // Sentences with key indicators
    const keywordSentences = sentences.filter(s => 
      s.toLowerCase().includes('important') ||
      s.toLowerCase().includes('key') ||
      s.toLowerCase().includes('main') ||
      s.toLowerCase().includes('significant') ||
      s.toLowerCase().includes('therefore') ||
      s.toLowerCase().includes('conclusion')
    )
    
    keySentences.push(...keywordSentences.slice(0, 2))
    
    // Last sentence if not already included
    if (!keySentences.includes(sentences[sentences.length - 1])) {
      keySentences.push(sentences[sentences.length - 1])
    }

    setSummary(keySentences.join('. ') + '.')
  }

  const extractKeyPhrases = (text) => {
    // Simple key phrase extraction
    const words = text.toLowerCase().split(/\W+/)
    const phrases = []
    
    // Look for repeated important words
    const wordFreq = {}
    words.forEach(word => {
      if (word.length > 4) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })
    
    // Get top frequent words as key phrases
    const topWords = Object.entries(wordFreq)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word)
    
    return topWords
  }

  const processNotes = () => {
    generateOutline(notes)
    generateMindMap(notes)
    generateFlashcards(notes)
    generateSummary(notes)
  }

  const saveNotes = () => {
    const noteData = {
      id: Date.now(),
      title: title || 'Untitled Notes',
      content: notes,
      outline,
      mindMap,
      flashcards,
      summary,
      createdAt: new Date().toISOString()
    }
    
    setSavedNotes(prev => [noteData, ...prev])
    
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('study_notes') || '[]')
    existing.unshift(noteData)
    localStorage.setItem('study_notes', JSON.stringify(existing))
  }

  const loadNotes = (noteData) => {
    setTitle(noteData.title)
    setNotes(noteData.content)
    setOutline(noteData.outline || [])
    setMindMap(noteData.mindMap || { central: '', branches: [] })
    setFlashcards(noteData.flashcards || [])
    setSummary(noteData.summary || '')
  }

  const exportNotes = () => {
    const exportData = {
      title,
      notes,
      outline,
      mindMap,
      flashcards,
      summary,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'notes'}.json`
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
            <h1 className="text-2xl font-bold text-gray-800">Note-Taking & Summarizing</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={saveNotes}
              disabled={!notes.trim()}
              className="btn-animated"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Notes
            </Button>
            <Button
              variant="outline"
              onClick={exportNotes}
              disabled={!notes.trim()}
              className="btn-animated"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="outline">Outline</TabsTrigger>
            <TabsTrigger value="mindmap">Mind Map</TabsTrigger>
            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-4">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PenTool className="w-5 h-5 text-blue-600" />
                  <span>Note Editor</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title..."
                  className="text-lg font-semibold"
                />
                
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Start taking notes here... Use headers with # or * to organize your content."
                  rows={15}
                  className="w-full font-mono"
                />
                
                <div className="flex space-x-4">
                  <Button
                    onClick={processNotes}
                    disabled={!notes.trim()}
                    className="bg-blue-600 hover:bg-blue-700 btn-animated"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Process Notes
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setNotes('')}
                    className="btn-animated"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outline" className="space-y-4">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <List className="w-5 h-5 text-green-600" />
                  <span>Structured Outline</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {outline.length > 0 ? (
                  <div className="space-y-6">
                    {outline.map((section, index) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                          {section.title}
                        </h3>
                        <ul className="space-y-2">
                          {section.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex items-start space-x-2">
                              <span className="text-green-600 mt-1">•</span>
                              <span className="text-gray-700">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <List className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Process your notes to generate an outline</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mindmap" className="space-y-4">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GitBranch className="w-5 h-5 text-purple-600" />
                  <span>Mind Map</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {mindMap.branches.length > 0 ? (
                  <div className="flex flex-col items-center space-y-8">
                    {/* Central Topic */}
                    <div className="bg-purple-100 border-2 border-purple-500 rounded-full px-6 py-4">
                      <h2 className="text-xl font-bold text-purple-800">{mindMap.central}</h2>
                    </div>
                    
                    {/* Branches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                      {mindMap.branches.map((branch, index) => (
                        <div key={branch.id} className="relative">
                          <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-800 mb-2">{branch.title}</h3>
                            <ul className="space-y-1">
                              {branch.subtopics.map((subtopic, subIndex) => (
                                <li key={subIndex} className="text-sm text-blue-700">
                                  • {subtopic}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Connection line (visual representation) */}
                          <div className="absolute -top-4 left-1/2 w-px h-4 bg-gray-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <GitBranch className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Process your notes to generate a mind map</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flashcards" className="space-y-4">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <span>Generated Flashcards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {flashcards.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {flashcards.map((card, index) => (
                      <div key={card.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-orange-100 p-4 border-b">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{card.type}</Badge>
                            <span className="text-sm text-gray-500">Card {index + 1}</span>
                          </div>
                          <p className="font-semibold text-gray-800">{card.front}</p>
                        </div>
                        <div className="bg-white p-4">
                          <p className="text-gray-700">{card.back}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Process your notes to generate flashcards</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <span>Concise Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary ? (
                  <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-gray-800 leading-relaxed">{summary}</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Process your notes to generate a summary</p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Key Takeaways</h4>
                  <Textarea
                    placeholder="Add your key takeaways and insights..."
                    rows={4}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            <Card className="card-hover">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Save className="w-5 h-5 text-gray-600" />
                  <span>Saved Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {savedNotes.length > 0 ? (
                  <div className="space-y-4">
                    {savedNotes.map((note, index) => (
                      <div key={note.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">{note.title}</h3>
                            <p className="text-sm text-gray-500">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => loadNotes(note)}
                              className="btn-animated"
                            >
                              Load
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSavedNotes(prev => prev.filter(n => n.id !== note.id))
                                const existing = JSON.parse(localStorage.getItem('study_notes') || '[]')
                                const updated = existing.filter(n => n.id !== note.id)
                                localStorage.setItem('study_notes', JSON.stringify(updated))
                              }}
                              className="btn-animated text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Save className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">No saved notes yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default NoteTaking

