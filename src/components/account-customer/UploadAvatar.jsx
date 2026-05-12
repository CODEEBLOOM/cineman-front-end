import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const resolveAvatarSrc = (avatar) => {
  if (!avatar) {
    return '';
  }

  if (/^https?:\/\//i.test(avatar)) {
    return avatar;
  }

  return `${import.meta.env.VITE_STORAGES}/${avatar}`;
};

const buildInitials = (fullName) => {
  if (!fullName) {
    return 'PC';
  }

  return fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
};

const UploadAvatar = ({ setAvatar, avatar = '' }) => {
  const { accessToken } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingPreview, setPendingPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const persistedSrc = useMemo(() => resolveAvatarSrc(avatar), [avatar]);
  const initials = useMemo(
    () => buildInitials(user?.fullName),
    [user?.fullName]
  );
  const displayedSrc = pendingPreview || persistedSrc;

  useEffect(() => {
    return () => {
      if (pendingPreview) {
        URL.revokeObjectURL(pendingPreview);
      }
    };
  }, [pendingPreview]);

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (pendingPreview) {
      URL.revokeObjectURL(pendingPreview);
    }

    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  };

  const handleSaveAvatar = async () => {
    if (!pendingFile) {
      toast.info('Hãy chọn ảnh trước khi lưu.');
      return;
    }

    const formData = new FormData();
    formData.append('file', pendingFile);

    try {
      setIsUploading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_HOST}/files/photo/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setAvatar(res.data.data);
      if (pendingPreview) {
        URL.revokeObjectURL(pendingPreview);
      }
      setPendingPreview('');
      setPendingFile(null);
      toast.success('Lưu ảnh đại diện thành công!');
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Lưu ảnh đại diện thất bại!'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
      <div className="h-[150px] w-[120px] flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-sm">
        {displayedSrc ? (
          <img
            src={displayedSrc}
            alt="Ảnh đại diện"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,#0a3448_0%,#06293a_55%,#041320_100%)]">
            <div className="text-center">
              <p className="text-[26px] font-bold tracking-[0.1em] text-white/95">
                {initials}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-cyan-200/80">
                Poly
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handlePickFile}
          disabled={isUploading}
          className="rounded-md border border-slate-300 bg-white px-5 py-2 text-[13px] font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:text-slate-800 disabled:opacity-60"
        >
          Thay đổi
        </button>
        <button
          type="button"
          onClick={handleSaveAvatar}
          disabled={!pendingFile || isUploading}
          className="rounded-md bg-[#3fb8af] px-5 py-2 text-[13px] font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#36a59c] disabled:cursor-not-allowed disabled:bg-[#a8d8d3]"
        >
          {isUploading ? 'Đang lưu...' : 'Lưu ảnh'}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileSelected}
          accept="image/*"
          multiple={false}
        />
      </div>
    </div>
  );
};

export default UploadAvatar;
