import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { 
  User, 
  Bell, 
  Palette, 
  Tag, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function ProfileSetup() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    notifications: true,
    defaultCategory: 'Personal',
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['Personal', 'Work', 'Health', 'Learning', 'Shopping', 'Other'];

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Simulate saving preferences
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        preferences: {
          ...state.user?.preferences,
          ...preferences,
          theme: 'light',
        },
      },
    });
    
    navigate('/dashboard');
    setIsLoading(false);
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to TaskFlow!</h1>
          <p className="text-gray-600 mt-2">Let's customize your experience to help you stay organized</p>
        </div>

        {/* Setup Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="space-y-8">
            {/* Welcome Message */}
            <div className="text-center p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Hi {state.user?.name}! 👋
              </h2>
              <p className="text-gray-700">
                We're excited to help you organize your tasks and boost your productivity. 
                Let's set up your preferences to get started.
              </p>
            </div>

            {/* Preferences */}
            <div className="space-y-6">
              {/* Default Category */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Default Category</h3>
                    <p className="text-gray-600 text-sm">Choose your most common task category</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 ml-13">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setPreferences({ ...preferences, defaultCategory: category })}
                      className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                        preferences.defaultCategory === category
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 transform scale-105'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                    <p className="text-gray-600 text-sm">Get reminded about your tasks and deadlines</p>
                  </div>
                </div>
                <div className="ml-13">
                  <button
                    onClick={() => setPreferences({ ...preferences, notifications: !preferences.notifications })}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                      preferences.notifications
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      preferences.notifications ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}>
                      {preferences.notifications && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span>Enable notifications</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">What you can do with TaskFlow:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Create and organize tasks</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Set priorities and due dates</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Track your progress</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">Categorize your work</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Setting up...</span>
                  </>
                ) : (
                  <>
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              <button
                onClick={handleSkip}
                className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            You can always change these preferences later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}