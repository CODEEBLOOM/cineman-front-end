import { createContext, useContext, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

const ModelContext = createContext();

export const useModelContext = () => useContext(ModelContext);

const ModelProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  useEffect(() => {
    document.body.style.overflow = modals.length > 0 ? 'hidden' : 'scroll';
  }, [modals]);

  const openPopup = (content) => {
    setModals((prev) => [...prev, content]); // Thêm modal vào stack
  };

  const closeTopModal = () => {
    setModals((prev) => prev.slice(0, -1)); // Xóa modal trên cùng
  };

  const resetModal = () => {
    setModals([]);
  };

  return (
    <ModelContext.Provider value={{ openPopup, closeTopModal, resetModal }}>
      {children}
      <AnimatePresence>
        {modals.map((content, index) => (
          <motion.div
            key={index}
            className="fixed inset-0 z-[1000]"
            style={{ zIndex: 1000 + index }} // đảm bảo modal mới nằm trên cùng
            // Overlay fade in/out
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              key={index}
              className="fixed inset-0 z-[1000] transition-opacity duration-200 ease-in-out"
            >
              <div
                className="absolute inset-0 flex items-center justify-center bg-slate-600/60 backdrop-blur-sm"
                onClick={closeTopModal}
              >
                <div
                  className="scale-95 transform transition-all duration-200 ease-out"
                  onClick={(e) => e.stopPropagation()}
                >
                  {content}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </ModelContext.Provider>
  );
};

export default ModelProvider;
