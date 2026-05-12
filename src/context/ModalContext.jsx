import { createContext, isValidElement, useContext, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ModelContext = createContext();

const getPlacementClass = (placement) => {
  switch (placement) {
    case 'center':
    case 'middle':
      return 'items-center justify-center';
    case 'bottom':
    case 'bottom-center':
      return 'items-end justify-center pb-4 sm:pb-6';
    case 'top':
    case 'top-center':
    default:
      return 'items-start justify-center pt-4 sm:pt-8';
  }
};

const getPlacementFromContent = (content) => {
  if (!isValidElement(content)) {
    return 'top-center';
  }

  return (
    content.props?.placement ??
    content.props?.modalPlacement ??
    content.props?.['data-modal-placement'] ??
    'top-center'
  );
};

export const useModelContext = () => useContext(ModelContext);

const ModelProvider = ({ children }) => {
  const [modals, setModals] = useState([]);

  useEffect(() => {
    document.body.style.overflow = modals.length > 0 ? 'hidden' : 'scroll';
  }, [modals]);

  const openPopup = (content) => {
    setModals((prev) => [...prev, content]);
  };

  const closeTopModal = () => {
    setModals((prev) => prev.slice(0, -1));
  };

  const resetModal = () => {
    setModals([]);
  };

  return (
    <ModelContext.Provider value={{ openPopup, closeTopModal, resetModal }}>
      {children}
      <AnimatePresence>
        {modals.map((content, index) => {
          const placement = getPlacementFromContent(content);

          return (
            <motion.div
              key={index}
              className="fixed inset-0 z-[1000]"
              style={{ zIndex: 1000 + index }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-slate-600/60 backdrop-blur-sm" />
              <div
                className={`absolute inset-0 flex overflow-y-auto p-4 transition-all duration-200 ease-out sm:p-6 ${getPlacementClass(placement)}`}
                onClick={closeTopModal}
              >
                <div
                  className="flex w-full justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {content}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </ModelContext.Provider>
  );
};

export default ModelProvider;