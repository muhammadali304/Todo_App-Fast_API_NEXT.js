'use client'

import { useState, useEffect } from 'react'
import { Plus, Sun, Moon, ListTodo, Edit2, Save, X, Trash2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { TodoList } from '@/components/TodoList'
import { Todo } from '@/types/todo'
import { todoService } from '@/lib/todoService'

// Animated Loading Component (defined outside main function to avoid hoisting issues)
const AnimatedLoadingScreen = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.5 } }}
    className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 transition-colors duration-300 flex items-center justify-center"
  >
    <div className="flex flex-col items-center justify-center space-y-6">
      <motion.div
        className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          scale: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 1,
          },
          rotate: {
            repeat: Infinity,
            repeatType: "reverse",
            duration: 2,
          },
        }}
      >
        <ListTodo size={48} />
      </motion.div>
      <motion.div
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        TODO APP
      </motion.div>
    </div>
  </motion.div>
);

export default function TodoPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    completed: false
  })
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(true)
  const [minLoadingTimeReached, setMinLoadingTimeReached] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Ensure minimum loading time of 1 second
  useEffect(() => {
    const minLoadingTimer = setTimeout(() => {
      setMinLoadingTimeReached(true);
    }, 1000);

    return () => clearTimeout(minLoadingTimer);
  }, []);

  // Load todos from API
  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    const startTime = Date.now();
    setLoading(true);
    try {
      const data = await todoService.getAllTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);

      // Wait for the minimum loading time if needed, then set loading to false
      setTimeout(() => {
        setLoading(false);
      }, remainingTime);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.title.trim()) return

    try {
      const createdTodo = await todoService.createTodo({
        title: newTodo.title,
        description: newTodo.description,
        completed: newTodo.completed
      })
      setTodos([...todos, createdTodo])
      setNewTodo({
        title: '',
        description: '',
        completed: false
      })
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    try {
      const updatedTodo = await todoService.updateTodo(id, {
        completed: !todo.completed
      })
      setTodos(todos.map(t => t.id === id ? updatedTodo : t))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id)
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const editTodo = async (id: number, updatedData: Partial<Todo>) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, updatedData)
      setTodos(todos.map(t => t.id === id ? updatedTodo : t))
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <AnimatedLoadingScreen key="loading" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 transition-colors duration-300"
        >
          <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Todo App</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full glass bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Add Todo Form */}
        <form onSubmit={addTodo} className="mb-8">
          <div className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                  placeholder="Task title..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                  placeholder="Task description..."
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="completed"
                  checked={newTodo.completed}
                  onChange={(e) => setNewTodo({...newTodo, completed: e.target.checked})}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="completed" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Completed
                </label>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Plus size={16} />
                Add Task
              </button>
            </div>
          </div>
        </form>

        {/* Todo List */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}