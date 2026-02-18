import React, { useEffect } from 'react';

const CHATBOT_PAGE_URL = import.meta.env.VITE_CHATBOT_PAGE_URL || '/chatbot-ui.html';
const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || 'http://127.0.0.1:5001/chat';

const ChatbotWidget = ({ isOpen, onClose, onToggle }) => {
  const iframeUrl = `${CHATBOT_PAGE_URL}${
    CHATBOT_PAGE_URL.includes('?') ? '&' : '?'
  }chatApi=${encodeURIComponent(CHATBOT_API_URL)}`;

  const closeChat = () => {
    if (onClose) {
      onClose();
      return;
    }
    if (onToggle) {
      onToggle();
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 p-2 backdrop-blur-[1px] sm:p-4">
      <div
        className="mx-auto flex h-full w-full max-w-[1500px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <div>
            <p className="text-base font-semibold text-green-800">AgriComply AI Assistant</p>
            <p className="text-xs text-gray-500">Embedded from your original chatbot UI</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={iframeUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              Open in Tab
            </a>
            <button
              type="button"
              onClick={closeChat}
              className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Close
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 bg-[#f4f7f4]">
          <iframe
            title="AgriComply Chatbot UI"
            src={iframeUrl}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
