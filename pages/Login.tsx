import React, { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Login: React.FC = () => {
  const [name, setName] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login({ name: name.trim() });
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Novel Translator AI
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Vui lòng nhập tên của bạn để tiếp tục
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-bold text-gray-600 dark:text-gray-300">
              Tên
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="Your Name"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
            >
              Đăng nhập
            </button>
          </div>
        </form>
        <div className="text-center mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>Đây là hệ thống đăng nhập mô phỏng.</p>
            <p>Khi có backend, chức năng này sẽ được thay thế bằng Đăng nhập Google.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
