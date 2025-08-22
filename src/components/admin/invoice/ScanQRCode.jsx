import { useModelContext } from '@context/ModalContext';
import { Button } from '@mui/material';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ScanQRCode = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 16 / 9,
      videoConstraints: {
        facingMode: 'environment',
        width: { ideal: 640 },
        height: { ideal: 360 },
      },
    });
    let timeoutId;

    scanner.render((decodedText) => {
      clearTimeout(timeoutId);
      closeTopModal();
      return window.open(
        `${import.meta.env.VITE_DOMAIN}/admin/invoice-detail/${decodedText}`,
        '_blank',
        'noopener,noreferrer'
      );
    });
    // Dừng sau 10 giây nếu không quét được
    timeoutId = setTimeout(() => {
      scanner
        .clear()
        .then(() => {
          toast.error('Quá hạn quét đơn hóa vui lòng quét lại !');
          closeTopModal();
        })
        .catch((err) => console.error('Clear error:', err));
    }, 10000);
    return () => {
      scanner.clear().catch((err) => console.error(err));
    };
  }, []);

  const { closeTopModal } = useModelContext();
  return (
    <div className="aspect-video w-[100vw] rounded-md bg-white p-5 md:w-[60vw]">
      <div
        className="max-h-[80vh] min-h-[60vh] border border-gray-400"
        id="reader"
      ></div>
      <div className="mt-3 flex gap-3">
        <Button
          variant="outlined"
          className="w-full"
          color="info"
          onClick={() => closeTopModal()}
        >
          Đóng
        </Button>
        <Button
          variant="contained"
          className="w-full"
          color="warning"
          onClick={() => closeTopModal()}
        >
          Quét lại
        </Button>
      </div>
    </div>
  );
};
export default ScanQRCode;
