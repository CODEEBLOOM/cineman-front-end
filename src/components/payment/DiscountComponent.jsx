import { TextField } from '@mui/material';
import CustomButton from '@component/CustomButton.jsx';
import Accordion from '@component/Accordion.jsx';
import React from 'react';

const DiscountComponent = () => {
  return (
    <>
      <div className={'my-5 flex h-[35px] items-center gap-3 leading-[35px]'}>
        <img src="ic-payment.png" alt="" className={'h-[100%]'} />
        <h2 className={'text-[20px] font-bold uppercase'}>Giảm giá</h2>
      </div>
      <Accordion title={'Đổi điểm'}>
        <div className={'grid gap-2 md:grid-cols-4'}>
          <div className="flex flex-col space-y-3">
            <p>Điêm hiện có</p>
            <p className={'text-[18px] font-bold'}>0</p>
          </div>
          <div className="flex flex-col space-y-3">
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

          <div className="flex flex-col space-y-3">
            <p>Số tiền được giảm</p>
            <div>
              <span className={'text-[18px] font-bold'}>30000</span>
              <span className={'text-[18px] font-bold'}>VNĐ</span>
            </div>
          </div>
          <div className="mt-3">
            <CustomButton title={'Đổi điểm'} />
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default DiscountComponent;
