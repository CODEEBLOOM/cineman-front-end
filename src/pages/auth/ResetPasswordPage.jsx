import AuthRecoveryLayout from '@component/auth/AuthRecoveryLayout';
import ResetPasswordComponent from '@component/auth/ResetPasswordComponent';

const ResetPasswordPage = () => {
  return (
    <AuthRecoveryLayout
      badge="Đặt lại mật khẩu"
      title="Tạo mật khẩu mới"
      backTo="/auth/forgot-password"
      backLabel="Quay lại quên mật khẩu"
    >
      <ResetPasswordComponent />
    </AuthRecoveryLayout>
  );
};

export default ResetPasswordPage;
