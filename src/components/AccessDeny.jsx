import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AccessDeny = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-4">
      <div className="relative w-full max-w-md rounded-3xl border border-red-100 bg-white p-10 text-center shadow-2xl">
        {/* Icon vòng tròn đỏ nhạt */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 shadow-lg">
            <FaLock className="text-3xl text-red-600" />
          </div>
        </div>

        <h2 className="mt-12 text-3xl font-extrabold text-gray-800">
          Truy cập bị từ chối
        </h2>
        <p className="mt-4 leading-relaxed text-gray-600">
          Bạn không có quyền truy cập vào tài nguyên này.
          <br />
          Nếu bạn nghĩ đây là nhầm lẫn, vui lòng liên hệ quản trị viên.
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-8 rounded-xl bg-red-500 px-6 py-3 font-semibold text-white shadow transition hover:bg-red-600"
        >
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default AccessDeny;
