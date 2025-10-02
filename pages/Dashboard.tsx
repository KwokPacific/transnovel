import React, { useState, useEffect } from 'react';
import BookCard from '../components/BookCard';
import Modal from '../components/Modal';
import { Book } from '../types';
import { getBooks, addBook, updateBook, deleteBook } from '../services/db';
import { useNotification } from '../contexts/NotificationContext';

const Dashboard: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [formData, setFormData] = useState({ title: '', author: '', genre: '' });
  const [isSaving, setIsSaving] = useState(false);
  const { addNotification } = useNotification();


  useEffect(() => {
    setBooks(getBooks());
  }, []);

  const handleOpenAddModal = () => {
    setEditingBook(null);
    setFormData({ title: '', author: '', genre: '' });
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (book: Book) => {
    setEditingBook(book);
    setFormData({ title: book.title, author: book.author, genre: book.genre });
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      if (editingBook) {
        updateBook({ ...editingBook, ...formData });
        addNotification(`Đã cập nhật truyện "${formData.title}"!`, 'success');
      } else {
        addBook(formData);
        addNotification(`Đã thêm truyện "${formData.title}"!`, 'success');
      }
      setBooks([...getBooks()]);
      
      handleCloseModal();
      setIsSaving(false);

    }, 500);
  };

  const handleDeleteRequest = (book: Book) => {
    setBookToDelete(book);
  };

  const handleConfirmDelete = () => {
    if (bookToDelete) {
      deleteBook(bookToDelete.id);
      addNotification(`Đã xóa truyện "${bookToDelete.title}".`, 'info');
      setBooks(books.filter(b => b.id !== bookToDelete.id));
      setBookToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
        <button 
          onClick={handleOpenAddModal}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Thêm truyện mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} onEdit={handleOpenEditModal} onDelete={handleDeleteRequest} />
        ))}
      </div>

      <Modal title={editingBook ? "Chỉnh sửa truyện" : "Thêm truyện mới"} isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSaveBook} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên truyện</label>
                <input type="text" id="title" value={formData.title} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tác giả</label>
                <input type="text" id="author" value={formData.author} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thể loại</label>
                <input type="text" id="genre" value={formData.genre} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
             <div className="pt-4 flex justify-end">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 mr-2">Hủy</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 w-20 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed">{isSaving ? 'Đang lưu...' : 'Lưu'}</button>
            </div>
        </form>
      </Modal>

      {bookToDelete && (
        <Modal title="Xác nhận xóa" isOpen={!!bookToDelete} onClose={() => setBookToDelete(null)}>
          <p className="text-gray-700 dark:text-gray-300">Bạn có chắc chắn muốn xóa truyện "{bookToDelete.title}" không? Hành động này không thể hoàn tác.</p>
          <div className="pt-6 flex justify-end space-x-2">
             <button type="button" onClick={() => setBookToDelete(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Hủy</button>
             <button type="button" onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Xóa</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;