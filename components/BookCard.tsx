import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import { PencilIcon, TrashIcon } from './icons/Icons';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(book);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(book);
  };

  return (
    <Link to={`/books/${book.id}`} className="block group relative">
      <div className="overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300 ease-in-out">
        <img className="object-cover w-full h-56" src={book.coverUrl} alt={book.title} />
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors duration-200">{book.title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
          <p className="mt-2 text-xs font-semibold text-indigo-600 uppercase dark:text-indigo-400">{book.genre}</p>
        </div>
      </div>
       <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={handleEditClick} className="p-2 bg-gray-800 bg-opacity-50 rounded-full text-white hover:bg-opacity-75 focus:outline-none">
              <PencilIcon className="w-4 h-4" />
          </button>
          <button onClick={handleDeleteClick} className="p-2 bg-red-600 bg-opacity-70 rounded-full text-white hover:bg-opacity-90 focus:outline-none">
              <TrashIcon className="w-4 h-4" />
          </button>
      </div>
    </Link>
  );
};

export default BookCard;