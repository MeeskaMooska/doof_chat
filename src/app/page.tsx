"use client"

import * as React from "react"
import { Send, Moon, Sun, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

export default function ChatbotInterface() {
  const [messages, setMessages] = React.useState([
    { role: "bot", content: "Hello there student! I'm here to help you with your homework so we can rule the tri-state area!" }
  ])
  const [input, setInput] = React.useState("")
  const [darkMode, setDarkMode] = React.useState(false)
  const [isWaiting, setIsWaiting] = React.useState(false)
  const chatContainerRef = React.useRef<HTMLDivElement>(null)
  const [pdfFile, setPdfFile] = React.useState<File | null>(null);
  
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  async function promptModel(prompt: string): Promise<string> {
    try {
      const response = await axios.get('/.netlify/functions/promptModel', {
        params: {
          prompt: prompt
        }
      }
      );

      return response.data.response;
    } catch (error) {
      console.error('Error fetching data:', error);
      return "Sorry, I couldn't fetch the data. Please try again later.";
    }
  }

  const handleSend = async () => {
    if (input.trim() && !isWaiting) {
      setIsWaiting(true);
      
      // Append the user's message to the messages array
      setMessages(prevMessages => [...prevMessages, { role: "user", content: input }]);
      
      // Call the promptModel function
      let response = await promptModel(input);
      setInput("");
  
      // Append the bot's response to the messages array
      setMessages(prevMessages => [...prevMessages, { role: "bot", content: response }]);
      
      setIsWaiting(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setPdfFile(file);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click(); // Programmatically trigger the file input
  };

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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">DoofBot</CardTitle>
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
            className="flex w-full space-x-2 pt-6"
          >
            <Input
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`${darkMode ? 'bg-gray-700 text-white' : ''} ${isWaiting ? 'opacity-50' : ''}`}
              disabled={isWaiting}
            />
            {/* Hidden file input 
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button type="button" onClick={handleFileButtonClick} disabled={isWaiting}>
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Attach file</span>
            </Button>*/}
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