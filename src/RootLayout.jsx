import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import Loading from '@component/Loading';
import PromotionRealtimeListener from '@component/realtime/PromotionRealtimeListener.jsx';
import { Suspense, useEffect } from 'react';
import { IoIosArrowUp } from 'react-icons/io';
import { Outlet } from 'react-router-dom';
import ModalProvider from '@context/ModalContext.jsx';

function RootLayout() {
  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <ModalProvider>
      <div>
        <PromotionRealtimeListener />
        <Suspense fallback={<Loading minHeight="55vh" />}>
          <Outlet />
        </Suspense>
        <div
          className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-black/20 transition-all duration-200 hover:cursor-pointer hover:bg-black/50"
          onClick={() => handleScroll()}
        >
          <IoIosArrowUp size={30} color="white" />
        </div>
      </div>
    </ModalProvider>
  );
}

export default RootLayout;
