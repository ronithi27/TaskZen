import React from 'react';
import { useApp } from '../contexts/AppContext';
import { 
  CheckCircle2, 
  Calendar, 
  Tag, 
  RotateCcw, 
  Trash2,
  Trophy,
  Clock
} from 'lucide-react';

export default function CompletedTasks() {
  const { state, dispatch } = useApp();

  const completedTasks = state.tasks.filter(task => task.completed);
  const todayCompleted = completedTasks.filter(task => 
    task.completedAt && 
    new Date(task.completedAt).toDateString() === new Date().toDateString()
  );
  const thisWeekCompleted = completedTasks.filter(task => {
    if (!task.completedAt) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(task.completedAt) >= weekAgo;
  });

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-red-600 bg-red-100' },
  ];

  const handleUncompleteTask = (taskId) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: taskId,
        updates: {
          completed: false,
          completedAt: undefined,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Completed Tasks</h1>
        <p className="text-gray-600 mt-1">Celebrate your achievements and track your progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedTasks.length}</p>
              <p className="text-green-100 text-sm">Total Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayCompleted.length}</p>
              <p className="text-blue-100 text-sm">Completed Today</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{thisWeekCompleted.length}</p>
              <p className="text-purple-100 text-sm">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Completed Tasks List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Achievements</h2>
          <p className="text-gray-600 text-sm mt-1">
            {completedTasks.length > 0 
              ? `You've completed ${completedTasks.length} tasks. Keep up the great work!`
              : "No completed tasks yet. Start completing some tasks to see them here!"
            }
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {completedTasks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No completed tasks yet</h3>
              <p className="text-gray-600">
                Complete your first task to start building your achievement history!
              </p>
            </div>
          ) : (
            completedTasks
              .sort((a, b) => {
                if (!a.completedAt || !b.completedAt) return 0;
                return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
              })
              .map((task) => (
                <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 line-through">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="mt-1 text-gray-600 line-through">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 mt-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              priorities.find(p => p.value === task.priority)?.color
                            }`}>
                              {priorities.find(p => p.value === task.priority)?.label}
                            </span>
                            
                            <span className="inline-flex items-center space-x-1 text-sm text-gray-500">
                              <Tag className="w-4 h-4" />
                              <span>{task.category}</span>
                            </span>
                            
                            {task.completedAt && (
                              <span className="inline-flex items-center space-x-1 text-sm text-green-600">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>
                                  Completed on {new Date(task.completedAt).toLocaleDateString()}
                                </span>
                              </span>
                            )}
                            
                            {task.dueDate && (
                              <span className="inline-flex items-center space-x-1 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleUncompleteTask(task.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Mark as incomplete"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Motivational Section */}
      {completedTasks.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
            <p className="text-indigo-100 mb-4">
              You've completed {completedTasks.length} tasks. 
              {todayCompleted.length > 0 && ` Including ${todayCompleted.length} today!`}
              {" "}Every completed task is a step towards your goals.
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">{completedTasks.length}</div>
                <div className="text-indigo-200">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">{thisWeekCompleted.length}</div>
                <div className="text-indigo-200">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-300">
                  {Math.round((completedTasks.length / Math.max(state.tasks.length, 1)) * 100)}%
                </div>
                <div className="text-indigo-200">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}