import AuthRecoveryLayout from '@component/auth/AuthRecoveryLayout';
import ForgotPasswordComponent from '@component/auth/ForgotPasswordComponent';

const ForgotPasswordPage = () => {
  return (
    <AuthRecoveryLayout
      badge="Quên mật khẩu"
      title="Gửi liên kết đặt lại mật khẩu"
      description="Nhập email đã đăng ký để hệ thống tạo mã khôi phục và gửi liên kết đặt lại mật khẩu cho tài khoản của bạn."
    >
      <ForgotPasswordComponent />
    </AuthRecoveryLayout>
  );
};

export default ForgotPasswordPage;
