import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { getGlossary, addGlossaryTerm, updateGlossaryTerm, deleteGlossaryTerm, getBooks } from '../services/db';
import { GlossaryTerm, Book } from '../types';
import { PencilIcon, TrashIcon } from '../components/icons/Icons';
import { useNotification } from '../contexts/NotificationContext';


const Glossary: React.FC = () => {
  const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);
  const [termToDelete, setTermToDelete] = useState<GlossaryTerm | null>(null);
  const [formData, setFormData] = useState<{original: string, translation: string, bookId: string}>({ original: '', translation: '', bookId: '' });
  const { addNotification } = useNotification();

  useEffect(() => {
    setGlossary(getGlossary());
    const allBooks = getBooks();
    setBooks(allBooks);
    if (allBooks.length > 0) {
      setSelectedBookId(allBooks[0].id);
      setFormData(prev => ({...prev, bookId: allBooks[0].id}));
    }
  }, []);
  
  const resetFormData = () => {
    setFormData({ original: '', translation: '', bookId: selectedBookId || (books.length > 0 ? books[0].id : '') });
  };

  const handleOpenAddModal = () => {
    setEditingTerm(null);
    resetFormData();
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (term: GlossaryTerm) => {
    setEditingTerm(term);
    setFormData({
      original: term.original,
      translation: term.translation,
      bookId: term.bookId,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTerm(null);
  };

  const handleSaveTerm = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.original || !formData.translation || !formData.bookId) {
        addNotification('Vui lòng điền đầy đủ các trường.', 'error');
        return;
      }
      
      if (editingTerm) {
        updateGlossaryTerm({ ...editingTerm, ...formData });
        addNotification('Đã cập nhật thuật ngữ!', 'success');
      } else {
        addGlossaryTerm(formData);
        addNotification('Đã thêm thuật ngữ mới!', 'success');
      }
      
      setGlossary(getGlossary()); // Re-fetch and sort
      handleCloseModal();
  };

  const handleDeleteRequest = (term: GlossaryTerm) => {
    setTermToDelete(term);
  };

  const handleConfirmDelete = () => {
    if (termToDelete) {
      deleteGlossaryTerm(termToDelete.id);
      addNotification(`Đã xóa thuật ngữ "${termToDelete.original}".`, 'info');
      setGlossary(glossary.filter(g => g.id !== termToDelete.id));
      setTermToDelete(null);
    }
  };


  const filteredGlossary = glossary.filter(term => term.bookId === selectedBookId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Glossary</h2>
        <div className="flex items-center space-x-4">
          <select 
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          >
            {books.map(book => <option key={book.id} value={book.id}>{book.title}</option>)}
          </select>
          <button
            onClick={handleOpenAddModal} 
            disabled={!selectedBookId}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed">
            Thêm mục mới
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Từ gốc</th>
              <th scope="col" className="px-6 py-3">Nghĩa dịch</th>
              <th scope="col" className="px-6 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredGlossary.map((term) => (
              <tr key={term.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {term.original}
                </th>
                <td className="px-6 py-4">
                  {term.translation}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center space-x-2">
                     <button onClick={() => handleOpenEditModal(term)} className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                       <PencilIcon className="w-4 h-4" />
                     </button>
                     <button onClick={() => handleDeleteRequest(term)} className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500">
                       <TrashIcon className="w-4 h-4" />
                     </button>
                  </div>
                </td>
              </tr>
            ))}
             {filteredGlossary.length === 0 && (
                <tr>
                    <td colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Chưa có thuật ngữ nào cho truyện này.
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>

      <Modal title={editingTerm ? "Chỉnh sửa mục" : "Thêm mục mới"} isOpen={isModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSaveTerm} className="space-y-4">
            <div>
                <label htmlFor="bookId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Truyện</label>
                <select id="bookId" value={formData.bookId} onChange={(e) => setFormData({ ...formData, bookId: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                   {books.map(book => <option key={book.id} value={book.id}>{book.title}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="original" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Từ gốc (Original)</label>
                <input type="text" id="original" value={formData.original} onChange={(e) => setFormData({ ...formData, original: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
                <label htmlFor="translation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nghĩa dịch (Translation)</label>
                <input type="text" id="translation" value={formData.translation} onChange={(e) => setFormData({ ...formData, translation: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
             <div className="pt-4 flex justify-end">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 mr-2">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Lưu</button>
            </div>
        </form>
      </Modal>

      {termToDelete && (
        <Modal title="Xác nhận xóa" isOpen={!!termToDelete} onClose={() => setTermToDelete(null)}>
          <p className="text-gray-700 dark:text-gray-300">Bạn có chắc chắn muốn xóa thuật ngữ "{termToDelete.original}" không? Hành động này không thể hoàn tác.</p>
          <div className="pt-6 flex justify-end space-x-2">
             <button type="button" onClick={() => setTermToDelete(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Hủy</button>
             <button type="button" onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Xóa</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Glossary;