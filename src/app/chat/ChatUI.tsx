"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { PaperAirplaneIcon, TrashIcon, SparklesIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid"
import ReactMarkdown from "react-markdown"
import { createAgent } from "@/app/lib/agent"

type Message = {
  role: "user" | "model" | "system"
  content: string
  timestamp: number
}

export default function AgentInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [agent, setAgent] = useState<ReturnType<typeof createAgent> | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const [darkMode, setDarkMode] = useState(false)

  // Initialize agent with persistent conversation
  useEffect(() => {
    const newAgent = createAgent("AIzaSyBEmX7lHyc93FwqPFVmCRrXYWQ9GO2Tc9E")
    // Load saved messages from localStorage
    const savedMessages = localStorage.getItem("agent-messages")
    const initialMessages = savedMessages ? JSON.parse(savedMessages) : []

    // Initialize with saved messages or default personality
    newAgent.initialize("You are a helpful AI assistant. Be concise and friendly.")

    // If we have saved messages, restore them
    if (initialMessages.length > 0) {
      setMessages(initialMessages)
      // Replay the conversation to the agent (except system messages)
      initialMessages.forEach((msg: Message) => {
        if (msg.role !== "system") {
          newAgent.processInput(msg.content).catch(console.error)
        }
      })
    }

    setAgent(newAgent)

    return () => {
      // Save messages to localStorage when component unmounts
      localStorage.setItem("agent-messages", JSON.stringify(messages))
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle dark mode persistence
  useEffect(() => {
    const savedTheme = localStorage.getItem("agent-theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldUseDark = savedTheme === "dark" || (!savedTheme && prefersDark)

    setDarkMode(shouldUseDark)
    document.documentElement.classList.toggle("dark", shouldUseDark)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem("agent-theme", newDarkMode ? "dark" : "light")
    document.documentElement.classList.toggle("dark", newDarkMode)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading || !agent) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    // Optimistically update UI
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await agent.processInput(input)
      const assistantMessage: Message = {
        role: "model",
        content: response,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: Date.now(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleClearConversation = () => {
    if (agent) {
      agent.clearConversation()
      setMessages([])
      localStorage.removeItem("agent-messages")
    }
  }

  return (
    <div
      className={`flex flex-col h-screen max-w-4xl mx-auto transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      }`}
    >
      {/* Header */}
      <div
        className={`backdrop-blur-sm border-b p-4 shadow-sm transition-all duration-300 ${
          darkMode ? "bg-slate-800/80 border-slate-700/60" : "bg-white/80 border-slate-200/60"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
            </div>
            <div>
              <h1
                className={`text-xl font-semibold transition-colors duration-300 ${
                  darkMode ? "text-slate-100" : "text-slate-800"
                }`}
              >
                AI Assistant
              </h1>
              <p className={`text-sm transition-colors duration-300 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Always here to help
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                darkMode
                  ? "bg-slate-700 hover:bg-slate-600 text-yellow-400"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            {messages.length > 0 && (
              <button
                onClick={handleClearConversation}
                className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-all duration-200 group ${
                  darkMode
                    ? "text-slate-400 hover:text-red-400 hover:bg-red-900/20"
                    : "text-slate-600 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                <TrashIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h2
              className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${
                darkMode ? "text-slate-200" : "text-slate-700"
              }`}
            >
              Welcome to your AI Assistant
            </h2>
            <p className={`max-w-md transition-colors duration-300 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Start a conversation by typing a message below. I'm here to help with any questions you might have!
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div
              className={`max-w-3xl rounded-2xl px-6 py-4 shadow-sm transition-all duration-300 hover:shadow-md ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-12"
                  : message.role === "system"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white mr-12"
                    : darkMode
                      ? "bg-slate-800 text-slate-100 mr-12 border border-slate-700/60"
                      : "bg-white text-slate-800 mr-12 border border-slate-200/60"
              }`}
            >
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    code: ({ children }) => (
                      <code
                        className={`px-2 py-1 rounded text-sm ${
                          message.role === "user"
                            ? "bg-blue-400/30"
                            : darkMode
                              ? "bg-slate-700 text-slate-200"
                              : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {children}
                      </code>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
              <div
                className={`text-xs mt-3 ${
                  message.role === "user" ? "text-blue-100" : darkMode ? "text-slate-400" : "text-slate-400"
                }`}
              >
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-slide-up">
            <div
              className={`rounded-2xl px-6 py-4 max-w-3xl mr-12 shadow-sm transition-all duration-300 ${
                darkMode
                  ? "bg-slate-800 text-slate-100 border border-slate-700/60"
                  : "bg-white text-slate-800 border border-slate-200/60"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? "bg-slate-400" : "bg-slate-400"}`}
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
                <span className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div
        className={`backdrop-blur-sm border-t p-6 transition-all duration-300 ${
          darkMode ? "bg-slate-800/80 border-slate-700/60" : "bg-white/80 border-slate-200/60"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full rounded-2xl px-6 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm ${
                darkMode
                  ? "border border-slate-600 bg-slate-700/90 text-slate-100 placeholder-slate-400"
                  : "border border-slate-300 bg-white/90 text-slate-800 placeholder-slate-400"
              }`}
              placeholder="Type your message here..."
              disabled={loading}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 group"
          >
            <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </form>
      </div>
    </div>
  )
}
