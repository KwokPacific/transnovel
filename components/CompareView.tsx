
import React, { useRef, useEffect } from 'react';

interface CompareViewProps {
    original: string;
    translated: string;
}

const CompareView: React.FC<CompareViewProps> = ({ original, translated }) => {
    const originalRef = useRef<HTMLDivElement>(null);
    const translatedRef = useRef<HTMLDivElement>(null);
    const isSyncing = useRef(false);

    const handleScroll = (scroller: React.RefObject<HTMLDivElement>, receiver: React.RefObject<HTMLDivElement>) => () => {
        if (isSyncing.current) return;
        
        isSyncing.current = true;
        
        if (scroller.current && receiver.current) {
            const { scrollTop, scrollHeight, clientHeight } = scroller.current;
            const scrollRatio = scrollTop / (scrollHeight - clientHeight);
            
            const receiverScrollTop = (receiver.current.scrollHeight - receiver.current.clientHeight) * scrollRatio;
            receiver.current.scrollTop = receiverScrollTop;
        }

        requestAnimationFrame(() => {
            isSyncing.current = false;
        });
    };

    useEffect(() => {
        const originalEl = originalRef.current;
        const translatedEl = translatedRef.current;

        if (originalEl && translatedEl) {
            const onOriginalScroll = handleScroll(originalRef, translatedRef);
            const onTranslatedScroll = handleScroll(translatedRef, originalRef);

            originalEl.addEventListener('scroll', onOriginalScroll);
            translatedEl.addEventListener('scroll', onTranslatedScroll);

            return () => {
                originalEl.removeEventListener('scroll', onOriginalScroll);
                translatedEl.removeEventListener('scroll', onTranslatedScroll);
            };
        }
    }, [original, translated]);

    return (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Nguyên văn</h3>
                <div ref={originalRef} className="overflow-y-auto flex-1">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-serif leading-relaxed">
                        {original}
                    </p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Bản dịch</h3>
                <div ref={translatedRef} className="overflow-y-auto flex-1">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                        {translated}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CompareView;
