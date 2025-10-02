import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBook, getChapters } from '../services/db';
import { Book, Chapter } from '../types';

const BookDetail: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  
  useEffect(() => {
    if (bookId) {
      const foundBook = getBook(bookId);
      const bookChapters = getChapters(bookId);
      setBook(foundBook || null);
      setChapters(bookChapters);
    }
  }, [bookId]);

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start mb-8">
        <img src={book.coverUrl} alt={book.title} className="w-48 h-auto rounded-lg shadow-lg mb-4 md:mb-0 md:mr-8" />
        <div>
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">{book.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">{book.author}</p>
          <span className="mt-4 inline-block px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-200 rounded-full dark:bg-indigo-900 dark:text-indigo-300">{book.genre}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">Chương</h3>
        <Link 
          to={`/books/${book.id}/chapters/new`} 
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Thêm chương mới
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {chapters.length > 0 ? chapters.map((chapter) => (
            <li key={chapter.id}>
              <Link to={`/books/${book.id}/chapters/${chapter.id}`} className="block px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">{chapter.title}</p>
              </Link>
            </li>
          )) : (
            <li className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Chưa có chương nào.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BookDetail;