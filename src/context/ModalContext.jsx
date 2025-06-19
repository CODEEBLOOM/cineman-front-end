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
        <div className="fixed inset-0">
          <div
            className="absolute inset-0 flex items-center justify-center bg-slate-600/60"
            onClick={() => setIsShowing(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>{content}</div>
          </div>
        </div>
      )}
    </ModelContext.Provider>
  );
};
export default ModelProvider;
