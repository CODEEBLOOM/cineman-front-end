import { Button } from '@mui/material';
import { accountPrimaryButtonSx } from '@component/account-customer/accountUiStyles';
import axios from 'axios';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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

  const avatarSrc = useMemo(() => resolveAvatarSrc(avatar), [avatar]);
  const initials = useMemo(() => buildInitials(user?.fullName), [user?.fullName]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    axios
      .post(`${import.meta.env.VITE_HOST}/files/photo/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        setAvatar(res.data.data);
        toast.success('Tải ảnh đại diện thành công!');
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message || 'Tải ảnh đại diện thất bại!'
        );
      })
      .finally(() => {
        event.target.value = '';
      });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.25),transparent_70%)] blur-2xl" />
        <div className="relative flex h-[220px] w-[220px] items-center justify-center overflow-hidden rounded-full border-[4px] border-[#d3b06b] bg-[linear-gradient(180deg,#041320_0%,#06293a_45%,#0c4056_100%)] shadow-[0_16px_38px_rgba(15,23,42,0.18)] md:h-[240px] md:w-[240px]">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Ảnh đại diện"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,#0a3448_0%,#071a2b_42%,#05111c_100%)]">
              <div className="text-center">
                <p className="text-[48px] font-bold tracking-[0.12em] text-white/95 md:text-[54px]">
                  {initials}
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.45em] text-cyan-200/75">
                  Poly Cinemas
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Button
        variant="contained"
        color="warning"
        component="label"
        sx={accountPrimaryButtonSx}
      >
        Tải ảnh đại diện
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          accept="image/*"
          multiple={false}
        />
      </Button>

      <p className="max-w-[240px] text-center text-[13px] leading-5 text-slate-500">
        Ảnh đại diện sẽ được cập nhật ngay sau khi tải lên. Nên dùng ảnh vuông,
        rõ mặt để hiển thị đẹp hơn trong hồ sơ thành viên.
      </p>
    </div>
  );
};

export default UploadAvatar;
