import { findUserByEmail } from '@apis/userService';
import { Button, CircularProgress, TextField } from '@mui/material';
import {
  setCustomer,
  setVoucher,
  updateInvoice,
} from '@redux/slices/invoiceSlice';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const InfoUserComponent = ({ showTime }) => {
  const { user } = useSelector((state) => state.user);
  const isReceptionistRole = user?.roles?.some((role) => role.roleId === 'RCP');
  const { invoices, customer, voucher } = useSelector((state) => state.invoice);
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const invoice = invoices.find((i) => i.showTimeId === Number(showTime.id));

    if (customer) {
      if (invoice) {
        dispatch(
          updateInvoice({
            ...invoice,
            invoice: {
              ...invoice.invoice,
              email: customer.email,
              phoneNumber: customer.phoneNumber,
              customerId: customer.userId,
            },
          })
        );
        return;
      }
    } else {
      if (invoice) {
        let newInfoInvoice;
        if (isReceptionistRole) {
          newInfoInvoice = {
            ...invoice,
            invoice: {
              ...invoice.invoice,
              email: user.email,
              phoneNumber: user.phoneNumber,
              customerId: null,
              staffId: user.userId,
            },
          };
        } else {
          newInfoInvoice = {
            ...invoice,
            invoice: {
              ...invoice.invoice,
              email: user.email,
              phoneNumber: user.phoneNumber,
              customerId: user.userId,
              staffId: null,
            },
          };
        }
        dispatch(updateInvoice(newInfoInvoice));
      }
    }
  }, [customer, dispatch, showTime, isReceptionistRole, user]);

  const handleFindUser = () => {
    setIsLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const value = inputRef.current.value;
    if (emailRegex.test(value)) {
      findUserByEmail(value)
        .then((res) => {
          if (res.data === null) {
            toast.error('Không tìm thấy người dùng !');
            setIsLoading(false);
            return;
          }

          // Kiểm tra có phải là user hay không //
          const isUser = res.data.roles.find((role) => role.roleId === 'USER');
          if (!isUser) {
            toast.error('Không tìm thấy người dùng !');
            setIsLoading(false);
            return;
          }
          dispatch(setCustomer(res.data));
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      toast.error('Vui lòng nhập đúng định dạng email !');
      setIsLoading(false);
    }
  };

  const handleCancelCustomer = () => {
    dispatch(setCustomer(null));
    if (voucher) {
      const invoice = invoices.find(
        (i) => i.showTimeId === Number(showTime.id)
      );
      dispatch(
        updateInvoice({
          ...invoice,
          invoice: {
            ...invoice.invoice,
            customerId: null,
            staffId: user.userId,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            totalMoney: invoice.invoice.totalMoney + voucher.discount,
            promotionId: null,
          },
        })
      );
      dispatch(setVoucher(null));
    }
  };

  return (
    <>
      <div className={''}>
        <div className={'flex h-[35px] items-center gap-3 leading-[35px]'}>
          <img src="ic-inforpayment.png" alt="" className={'h-[100%]'} />
          <h2 className={'text-[20px] font-bold uppercase'}>
            Thông tin thanh toán
          </h2>
        </div>
        {isReceptionistRole ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="mt-3">
              <h2 className="text-[18px] font-bold">Thông tin người đặt vé</h2>
              <div className="flex flex-wrap gap-2">
                <p className={'font-bold'}>Họ Tên:</p>
                <p>{user?.fullName}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <p className={'font-bold'}>Số điện thoại:</p>
                <p>{user?.phoneNumber}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <p className={'font-bold'}>Email:</p>
                <p>{user?.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <p className={'font-bold'}>Vai trò:</p>
                <p>
                  {user?.roles[0].roleId === 'RCP'
                    ? 'Nhân viên tiếp nhận'
                    : 'Khách hàng'}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <h2 className="text-[18px] font-bold">Thông tin khách hàng</h2>
              {!customer?.fullName && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <TextField
                      fullWidth
                      placeholder="Nhập email khách hàng ..."
                      type="email"
                      required={true}
                      inputRef={inputRef}
                      slotProps={{
                        input: { className: 'h-10 px-3 py-2 ' },
                        htmlInput: { className: '!px-0 ' },
                      }}
                    />
                  </div>
                  <div onClick={handleFindUser}>
                    <Button variant="contained" className="mt-3 flex gap-2">
                      {isLoading && (
                        <CircularProgress
                          size={20}
                          thickness={2}
                          color="inherit"
                        />
                      )}
                      Xác nhận
                    </Button>
                  </div>
                </div>
              )}
              {customer?.fullName && (
                <>
                  <div className="flex flex-wrap gap-2">
                    <p className={'font-bold'}>Họ Tên:</p>
                    <p>{customer?.fullName}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className={'font-bold'}>Số điện thoại:</p>
                    <p>{customer?.phoneNumber}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className={'font-bold'}>Email:</p>
                    <p>{customer?.email}</p>
                  </div>
                  <div onClick={handleCancelCustomer}>
                    <Button variant="outlined">Tìm kiếm thêm</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div
            className={
              'mt-4 flex flex-col flex-wrap justify-between gap-3 md:flex-row'
            }
          >
            <div className={''}>
              <p className={'font-bold'}>Họ Tên:</p>
              <p>{user?.fullName}</p>
            </div>

            <div className={''}>
              <p className={'font-bold'}>Số điện thoại:</p>
              <p>{user?.phoneNumber}</p>
            </div>

            <div className={''}>
              <p className={'font-bold'}>Email:</p>
              <p>{user?.email}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InfoUserComponent;
