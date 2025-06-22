import { createContext, useContext, useEffect, useState } from 'react';

const ModelContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useModelContext = () => {
  return useContext(ModelContext);
};

const ModelProvider = ({ children }) => {
  const [isShowing, setIsShowing] = useState(false);
  const [content, setContent] = useState();

  useEffect(() => {
    if (isShowing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'scroll';
    }
  }, [isShowing]);

  const openPopup = (content) => {
    setIsShowing(true);
    setContent(content);
  };

  return (
    <ModelContext.Provider value={{ openPopup, setIsShowing }}>
      {children}
      {isShowing && (
        <div className="fixed inset-0 z-50 transition-opacity duration-200 ease-in-out">
          <div
            className="absolute inset-0 flex items-center justify-center bg-slate-600/60 backdrop-blur-sm"
            onClick={() => setIsShowing(false)}
          >
            <div
              className="scale-95 transform animate-fade-in opacity-0 transition-all duration-200 ease-out"
              onClick={(e) => e.stopPropagation()}
            >
              {content}
            </div>
          </div>
        </div>
      )}
    </ModelContext.Provider>
  );
};
export default ModelProvider;
