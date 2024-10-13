'use client'

import * as React from "react"
import { Send, Moon, Sun, Paperclip } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function ChatbotInterfaceComponent() {
  const [messages, setMessages] = React.useState([
    { role: "bot", content: "Hello! How can I assist you today?" }
  ])
  const [input, setInput] = React.useState("")
  const [darkMode, setDarkMode] = React.useState(false)
  const [isWaiting, setIsWaiting] = React.useState(false)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)

  const handleSend = async () => {
    if (input.trim() && !isWaiting) {
      setIsWaiting(true)
      setMessages([...messages, { role: "user", content: input }])
      setInput("")
      
      // Simulating API call with setTimeout
      setTimeout(() => {
        setMessages(prev => [...prev, { role: "bot", content: "This is a simulated response." }])
        setIsWaiting(false)
      }, 1000)
      
      // Here you would typically send the input to your chatbot API
      // const response = await yourChatbotAPI(input);
      // setMessages(prev => [...prev, { role: "bot", content: response }]);
      // setIsWaiting(false);
    }
  }

  const handleFileSubmit = () => {
    // Empty function for file submission
    console.log("File submit button clicked")
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 bg-gradient-to-r ${
      darkMode ? 'from-purple-900 to-gray-900' : 'from-blue-100 to-white'
    }`}>
      <Card className={`w-full max-w-4xl h-[80vh] shadow-xl flex flex-col ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Chatbot</CardTitle>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden relative">
          <div className={`absolute top-0 left-0 right-0 h-px ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
          <div
            ref={chatContainerRef}
            className="h-full overflow-y-auto space-y-4 px-4 py-2 scroll-smooth"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[70%] ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : darkMode
                      ? 'bg-gray-700'
                      : 'bg-gray-100'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-px ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`} />
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex w-full space-x-2"
          >
            <Input
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`${darkMode ? 'bg-gray-700 text-white' : ''} ${isWaiting ? 'opacity-50' : ''}`}
              disabled={isWaiting}
            />
            <Button type="button" onClick={handleFileSubmit} disabled={isWaiting}>
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button type="submit" disabled={isWaiting}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}