import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getChapter, updateChapter, addChapter, getBook, getGlossaryForBook, getCharactersForBook, getRelationsForBook } from '../services/db';
import { Chapter, Book, GlossaryTerm, Character, CharacterRelation } from '../types';
import { GoogleGenAI } from "@google/genai";
import { useNotification } from '../contexts/NotificationContext';

const ChapterEditor: React.FC = () => {
    const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
    const navigate = useNavigate();
    const isNewChapter = !chapterId || chapterId === 'new';

    const [book, setBook] = useState<Book | null>(null);
    const [glossary, setGlossary] = useState<GlossaryTerm[]>([]);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [relations, setRelations] = useState<CharacterRelation[]>([]);

    const [title, setTitle] = useState('');
    const [originalContent, setOriginalContent] = useState('');
    const [translatedContent, setTranslatedContent] = useState('');

    const [isTranslating, setIsTranslating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { addNotification } = useNotification();

    useEffect(() => {
        if (bookId) {
            const foundBook = getBook(bookId);
            setBook(foundBook || null);
            setGlossary(getGlossaryForBook(bookId));
            setCharacters(getCharactersForBook(bookId));
            setRelations(getRelationsForBook(bookId));
            
            if (!isNewChapter && chapterId) {
                const foundChapter = getChapter(bookId, chapterId);
                if (foundChapter) {
                    setTitle(foundChapter.title);
                    setOriginalContent(foundChapter.originalContent);
                    setTranslatedContent(foundChapter.translatedContent);
                }
            } else {
                setTitle('');
                setOriginalContent('');
                setTranslatedContent('');
            }
        }
    }, [bookId, chapterId, isNewChapter]);
    
    const handleTranslate = async () => {
        if (!originalContent) {
            addNotification('Nội dung gốc không được để trống.', 'error');
            return;
        }
        if (!process.env.API_KEY) {
            addNotification('Chưa cấu hình API Key.', 'error');
            return;
        }

        setIsTranslating(true);
        setTranslatedContent('');

        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

            const glossaryTerms = glossary.map(g => `${g.original}: ${g.translation}`).join('\n');
            const characterDetails = characters.map(c => `
- Tên: ${c.name_vi} (${c.name_cn})
- Biệt danh: ${c.alias || 'Không có'}
- Xưng hô ngôi thứ 3 (narrator): ${c.address_3rd || 'Mặc định theo tên'}
- Ghi chú: ${c.notes || 'Không có'}
            `).join('');

            const characterRelations = relations.map(r => {
                const fromChar = characters.find(c => c.id === r.from);
                const toChar = characters.find(c => c.id === r.to);
                if (fromChar && toChar) {
                    return `${fromChar.name_vi} gọi ${toChar.name_vi} là: ${r.address}`;
                }
                return '';
            }).filter(Boolean).join('\n');


            const systemInstruction = `Bạn là một dịch giả chuyên nghiệp chuyên dịch truyện tiên hiệp, huyền huyễn từ tiếng Trung sang tiếng Việt.
Dịch một cách tự nhiên, văn phong mượt mà, phù hợp với ngữ cảnh của truyện.
Tuyệt đối tuân thủ các thuật ngữ đã được cung cấp cho truyện này.

---
DANH SÁCH THUẬT NGỮ CỦA TRUYỆN (Original: Translation):
${glossaryTerms}
---
THÔNG TIN CHI TIẾT NHÂN VẬT:
Sử dụng các thông tin sau để hiểu rõ bối cảnh và tính cách nhân vật, từ đó quyết định văn phong và cách xưng hô cho phù hợp.
${characterDetails}
---
QUAN HỆ XƯNG HÔ:
Dựa vào các mối quan hệ sau đây để suy ra cách xưng hô phù hợp trong đối thoại. Mối quan hệ này có tính hai chiều, hãy tự suy luận cách xưng hô đáp lại. Ví dụ, nếu 'A gọi B là lão sư', thì B có thể gọi lại A là 'tiểu tử' hoặc 'đồ nhi' tùy ngữ cảnh.
${characterRelations}
---

BẮT ĐẦU DỊCH NỘI DUNG SAU:`

            const fullPrompt = `${systemInstruction}\n\n${originalContent}`;

            const responseStream = await ai.models.generateContentStream({
                model: "gemini-2.5-flash",
                contents: fullPrompt,
            });

            for await (const chunk of responseStream) {
                const chunkText = chunk.text;
                if (chunkText) {
                    setTranslatedContent(prev => prev + chunkText);
                }
            }

        } catch (error) {
            console.error("Error translating:", error);
            addNotification("Đã xảy ra lỗi khi dịch. Vui lòng kiểm tra console.", 'error');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSave = () => {
        if (!bookId || !title.trim()) {
            addNotification('Tiêu đề chương không được để trống.', 'error');
            return;
        }

        setIsSaving(true);
        
        setTimeout(() => {
            if (isNewChapter) {
                const newChapter = addChapter({ bookId, title, originalContent, translatedContent });
                addNotification('Đã lưu chương thành công!', 'success');
                navigate(`/books/${bookId}/chapters/${newChapter.id}`, { replace: true });
            } else {
                const updatedChapterData: Chapter = { id: chapterId!, bookId: bookId!, title, originalContent, translatedContent };
                updateChapter(updatedChapterData);
                addNotification('Đã lưu thay đổi thành công!', 'success');
            }
             setIsSaving(false);
        }, 500);
    };

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
            <div className="mb-4">
                <Link to={`/books/${book.id}`} className="text-indigo-600 dark:text-indigo-400 hover:underline">&larr; Trở về danh sách chương</Link>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Tiêu đề chương"
                  className="w-full mt-2 text-3xl font-bold bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:ring-0 focus:border-indigo-500 text-gray-800 dark:text-white"
                />
                <p className="text-lg text-gray-600 dark:text-gray-400">{book.title}</p>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mb-4">
                <button
                    onClick={handleTranslate}
                    disabled={isTranslating || !originalContent}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed flex items-center"
                >
                    {isTranslating && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isTranslating ? 'Đang dịch...' : 'Dịch tự động'}
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 w-24 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Đang lưu...' : 'Lưu'}
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Nguyên văn</h3>
                    <textarea
                        value={originalContent}
                        onChange={e => setOriginalContent(e.target.value)}
                        placeholder="Dán nội dung gốc vào đây..."
                        className="flex-1 w-full p-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif leading-relaxed whitespace-pre-wrap resize-none"
                    />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Bản dịch</h3>
                    <textarea
                        value={translatedContent}
                        onChange={e => setTranslatedContent(e.target.value)}
                        placeholder="Bản dịch sẽ xuất hiện ở đây sau khi dịch tự động, hoặc bạn có thể tự nhập."
                        className="flex-1 w-full p-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed whitespace-pre-wrap resize-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default ChapterEditor;