import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark';
    defaultCategory: string;
    notifications: boolean;
  };
}

interface AppState {
  user: User | null;
  tasks: Task[];
  isAuthenticated: boolean;
  filter: 'all' | 'active' | 'completed';
  sortBy: 'date' | 'priority' | 'category';
  searchTerm: string;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' }
  | { type: 'SET_SORT'; payload: 'date' | 'priority' | 'category' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'LOAD_DATA'; payload: { user: User | null; tasks: Task[] } };

const initialState: AppState = {
  user: null,
  tasks: [],
  isAuthenticated: false,
  filter: 'all',
  sortBy: 'date',
  searchTerm: '',
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        tasks: [],
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'ADD_TASK':
      const newTask: Task = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date(),
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? new Date() : undefined,
              }
            : task
        ),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    case 'LOAD_DATA':
      return {
        ...state,
        user: action.payload.user,
        tasks: action.payload.tasks,
        isAuthenticated: !!action.payload.user,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('todoApp_user');
    const savedTasks = localStorage.getItem('todoApp_tasks');
    
    const user = savedUser ? JSON.parse(savedUser) : null;
    const tasks = savedTasks ? JSON.parse(savedTasks).map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    })) : [];

    dispatch({ type: 'LOAD_DATA', payload: { user, tasks } });
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('todoApp_user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('todoApp_user');
    }
  }, [state.user]);

  useEffect(() => {
    localStorage.setItem('todoApp_tasks', JSON.stringify(state.tasks));
  }, [state.tasks]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}