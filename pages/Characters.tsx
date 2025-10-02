import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { getCharacters, addCharacter, updateCharacter, deleteCharacter, getRelations, addRelation } from '../services/db';
import { Character, CharacterRelation } from '../types';
import { PencilIcon, TrashIcon } from '../components/icons/Icons';
import { useNotification } from '../contexts/NotificationContext';


type Tab = 'list' | 'relations';

const Characters: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [relations, setRelations] = useState<CharacterRelation[]>([]);
  
  const [isCharModalOpen, setIsCharModalOpen] = useState(false);
  const [isRelationModalOpen, setIsRelationModalOpen] = useState(false);

  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);

  const initialFormState = { name_cn: '', name_vi: '', alias: '', notes: '', address_3rd: '' };
  const [formData, setFormData] = useState(initialFormState);
  
  const [newRelation, setNewRelation] = useState({ from: '', to: '', address: '' });
  const { addNotification } = useNotification();

  useEffect(() => {
    const chars = getCharacters();
    setCharacters(chars);
    setRelations(getRelations());
    if (chars.length > 1) {
      setNewRelation({ from: chars[0].id, to: chars[1].id, address: '' });
    } else if (chars.length > 0) {
      setNewRelation({ from: chars[0].id, to: chars[0].id, address: '' });
    }
  }, []);

  const findCharacterName = (id: string) => characters.find(c => c.id === id)?.name_vi || 'N/A';

  const handleOpenAddModal = () => {
    setEditingCharacter(null);
    setFormData(initialFormState);
    setIsCharModalOpen(true);
  };

  const handleOpenEditModal = (character: Character) => {
    setEditingCharacter(character);
    setFormData({
      name_cn: character.name_cn,
      name_vi: character.name_vi,
      alias: character.alias,
      notes: character.notes || '',
      address_3rd: character.address_3rd || ''
    });
    setIsCharModalOpen(true);
  };
  
  const handleCloseModal = () => {
      setIsCharModalOpen(false);
      setEditingCharacter(null);
  };

  const handleSaveCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_cn || !formData.name_vi) {
        addNotification('Tên nhân vật (tiếng Việt và Trung) không được để trống.', 'error');
        return;
    }

    if (editingCharacter) {
        const updated = updateCharacter({ ...editingCharacter, ...formData });
        setCharacters(characters.map(c => c.id === updated.id ? updated : c));
        addNotification('Đã cập nhật nhân vật!', 'success');
    } else {
        const addedChar = addCharacter(formData);
        setCharacters(prev => [...prev, addedChar]);
        addNotification('Đã thêm nhân vật mới!', 'success');
    }
    
    handleCloseModal();
  };

  const handleDeleteRequest = (character: Character) => {
      setCharacterToDelete(character);
  };

  const handleConfirmDelete = () => {
      if (characterToDelete) {
          deleteCharacter(characterToDelete.id);
          addNotification(`Đã xóa nhân vật "${characterToDelete.name_vi}".`, 'info');
          setCharacters(characters.filter(c => c.id !== characterToDelete.id));
          setCharacterToDelete(null);
      }
  };

  const handleAddRelation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRelation.from || !newRelation.to || !newRelation.address) {
        addNotification('Vui lòng điền đầy đủ thông tin quan hệ.', 'error');
        return;
    }
    if (newRelation.from === newRelation.to) {
      addNotification("Một nhân vật không thể có quan hệ với chính mình.", 'error');
      return;
    }
    const addedRelation = addRelation(newRelation);
    setRelations(prev => [...prev, addedRelation]);
    addNotification('Đã thêm quan hệ mới!', 'success');
    setIsRelationModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Characters</h2>
        <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
            Thêm nhân vật
        </button>
      </div>

      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2">
            <button 
              onClick={() => setActiveTab('list')}
              className={`inline-block p-4 rounded-t-lg border-b-2 ${activeTab === 'list' ? 'text-indigo-600 border-indigo-600 dark:text-indigo-500 dark:border-indigo-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
            >
              Danh sách nhân vật
            </button>
          </li>
          <li>
            <button 
              onClick={() => setActiveTab('relations')}
              className={`inline-block p-4 rounded-t-lg border-b-2 ${activeTab === 'relations' ? 'text-indigo-600 border-indigo-600 dark:text-indigo-500 dark:border-indigo-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
            >
              Quan hệ xưng hô
            </button>
          </li>
        </ul>
      </div>

      <div>
        {activeTab === 'list' && (
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
            <table className="min-w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">Tên (VN)</th>
                  <th scope="col" className="px-6 py-3">Tên (TQ)</th>
                  <th scope="col" className="px-6 py-3">Biệt danh</th>
                  <th scope="col" className="px-6 py-3">Xưng hô ngôi thứ 3</th>
                  <th scope="col" className="px-6 py-3">Ghi chú</th>
                  <th scope="col" className="px-6 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {characters.map(char => (
                  <tr key={char.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{char.name_vi}</td>
                    <td className="px-6 py-4">{char.name_cn}</td>
                    <td className="px-6 py-4">{char.alias}</td>
                    <td className="px-6 py-4">{char.address_3rd}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{char.notes}</td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                           <button onClick={() => handleOpenEditModal(char)} className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
                             <PencilIcon className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDeleteRequest(char)} className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500">
                             <TrashIcon className="w-4 h-4" />
                           </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'relations' && (
          <>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsRelationModalOpen(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                    Thêm quan hệ
                </button>
            </div>
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
              <table className="min-w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Từ</th>
                    <th scope="col" className="px-6 py-3">Đến</th>
                    <th scope="col" className="px-6 py-3">Cách gọi</th>
                  </tr>
                </thead>
                <tbody>
                  {relations.map(rel => (
                    <tr key={rel.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4">{findCharacterName(rel.from)}</td>
                      <td className="px-6 py-4">{findCharacterName(rel.to)}</td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{rel.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <Modal title={editingCharacter ? "Chỉnh sửa nhân vật" : "Thêm nhân vật"} isOpen={isCharModalOpen} onClose={handleCloseModal}>
        <form onSubmit={handleSaveCharacter} className="space-y-4">
            <div>
                <label htmlFor="name_vi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên (Tiếng Việt)</label>
                <input type="text" id="name_vi" value={formData.name_vi} onChange={(e) => setFormData({ ...formData, name_vi: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
                <label htmlFor="name_cn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên (Tiếng Trung)</label>
                <input type="text" id="name_cn" value={formData.name_cn} onChange={(e) => setFormData({ ...formData, name_cn: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </div>
            <div>
                <label htmlFor="alias" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Biệt danh</label>
                <input type="text" id="alias" value={formData.alias} onChange={(e) => setFormData({ ...formData, alias: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </div>
            <div>
                <label htmlFor="address_3rd" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Xưng hô ngôi thứ 3</label>
                <input type="text" id="address_3rd" value={formData.address_3rd} onChange={(e) => setFormData({ ...formData, address_3rd: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="ví dụ: thiếu niên, lão giả..." />
            </div>
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ghi chú</label>
                <textarea id="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Ghi chú về tính cách, bối cảnh..."/>
            </div>
             <div className="pt-4 flex justify-end">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 mr-2">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Lưu</button>
            </div>
        </form>
      </Modal>

      {characterToDelete && (
        <Modal title="Xác nhận xóa" isOpen={!!characterToDelete} onClose={() => setCharacterToDelete(null)}>
          <p className="text-gray-700 dark:text-gray-300">Bạn có chắc chắn muốn xóa nhân vật "{characterToDelete.name_vi}" không? Hành động này không thể hoàn tác.</p>
          <div className="pt-6 flex justify-end space-x-2">
             <button type="button" onClick={() => setCharacterToDelete(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Hủy</button>
             <button type="button" onClick={handleConfirmDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Xóa</button>
          </div>
        </Modal>
      )}

      <Modal title="Thêm quan hệ xưng hô" isOpen={isRelationModalOpen} onClose={() => setIsRelationModalOpen(false)}>
        <form onSubmit={handleAddRelation} className="space-y-4">
            <div>
                <label htmlFor="from" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Từ (Người gọi)</label>
                <select id="from" value={newRelation.from} onChange={(e) => setNewRelation({ ...newRelation, from: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                    {characters.map(c => <option key={c.id} value={c.id}>{c.name_vi} ({c.name_cn})</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Đến (Người được gọi)</label>
                <select id="to" value={newRelation.to} onChange={(e) => setNewRelation({ ...newRelation, to: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required>
                    {characters.map(c => <option key={c.id} value={c.id}>{c.name_vi} ({c.name_cn})</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cách gọi</label>
                <input type="text" id="address" value={newRelation.address} onChange={(e) => setNewRelation({ ...newRelation, address: e.target.value })} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" required placeholder="ví dụ: lão sư, ca ca, tiểu tử..." />
            </div>
             <div className="pt-4 flex justify-end">
                <button type="button" onClick={() => setIsRelationModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 mr-2">Hủy</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Lưu</button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default Characters;