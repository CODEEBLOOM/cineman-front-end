import React from 'react';

const InfoUserComponent = () => {
  return (
    <>
      <div className={''}>
        <div className={'flex h-[35px] items-center gap-3 leading-[35px]'}>
          <img src="ic-inforpayment.png" alt="" className={'h-[100%]'} />
          <h2 className={'text-[20px] font-bold uppercase'}>
            Thông tin thanh toán
          </h2>
        </div>
        <div
          className={
            'mt-4 flex flex-col flex-wrap justify-between gap-3 md:flex-row'
          }
        >
          <div className={''}>
            <p className={'font-bold'}>Họ Tên:</p>
            <p>Đỗ Quang Sơn</p>
          </div>

          <div className={''}>
            <p className={'font-bold'}>Số điện thoại:</p>
            <p>0443335223</p>
          </div>

          <div className={''}>
            <p className={'font-bold'}>Email:</p>
            <p>sondoquang@gmail.com</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoUserComponent;
