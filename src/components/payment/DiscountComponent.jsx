import { TextField } from '@mui/material';
import CustomButton from '@component/CustomButton.jsx';
import Accordion from '@component/Accordion.jsx';
import React from 'react';

const DiscountComponent = () => {
  return (
    <>
      <div className={'mt-5 flex h-[35px] items-center gap-3 leading-[35px]'}>
        <img src="ic-payment.png" alt="" className={'h-[100%]'} />
        <h2 className={'text-[20px] font-bold uppercase'}>Giảm giá</h2>
      </div>
      <Accordion title={'Cineman voucher'}>
        <div className={'grid gap-2 md:grid-cols-4'}>
          <div>
            <p>Điêm hiện có</p>
            <span className={'font-bold'}>0</span>
          </div>
          <div>
            <p>Nhập điểm</p>
            <TextField
              fullWidth
              placeholder={'Nhập điểm'}
              name={'savePoint'}
              type={'number'}
              slotProps={{
                input: { className: 'h-10 px-3 py-2 ' },
                htmlInput: { className: '!px-0' },
              }}
            />
          </div>
          <div>
            <p>Số tiền được giảm</p>
            <span>30000</span>
            vnđ
          </div>
          <div>
            <CustomButton title={'Đổi điểm'} />
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default DiscountComponent;
