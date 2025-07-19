import { useState, useEffect, useRef } from "react";

const Note = ({ isOpen, onClose, taskTitle, note, onSave }) => {
    const [noteText, setNoteText] = useState(note || "");
    const textareaRef = useRef(null);

    useEffect(() => {
        setNoteText(note || "");
    }, [note]);

    useEffect(() => {
        if (isOpen && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isOpen]);

    const handleSave = () => {
        onSave(noteText);
        onClose();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 's' && e.ctrlKey) {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <div className="mt-3 bg-glass-bg backdrop-blur-glass border border-glass-border rounded-lg relative">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 hover:bg-gray-500/20 rounded-full transition-colors z-10"
            >
                <svg className="w-4 h-4 text-gray-400 hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Textarea */}
            <textarea
                ref={textareaRef}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleSave}
                placeholder="Add your notes here..."
                className="w-full h-24 resize-none border-none outline-none text-text-primary text-sm leading-relaxed p-3 pr-10 bg-transparent"
            />
        </div>
    );
};

export default Note; 