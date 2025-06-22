import React from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';

const ComboComponent = () => {
  return (
    <div>
      <div className={'mt-5 flex h-[35px] items-center gap-3 leading-[35px]'}>
        <img src="ic-combo.png" alt="" className={'h-[100%]'} />
        <h2 className={'text-[20px] font-bold uppercase'}>Combo ưu đãi</h2>
      </div>
      <div className={'mt-5'}>
        <table className={'w-full'}>
          <thead>
            <tr className={'border-b-2'}>
              <th className={'w-[25%] pb-3'}></th>
              <th className={'pb-3'}>Tên Combo</th>
              <th className={'pb-3'}>Mô tả</th>
              <th className={'pb-3'}>Số lượng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={'px-3 py-5'}>
                <img
                  src="/combo-online-03.png"
                  alt="w-[160px] h-[160px] rounded-full"
                />
              </td>
              <td className={'px-3 py-5'}>
                <span className={'font-bold'}> Family Combo 69oz</span>
              </td>
              <td className={'px-3 py-5'}>
                <span>
                  {' '}
                  TIẾT KIỆM 95K!!! Gồm: 2 Bắp (69oz) + 4 Nước có gaz (22oz) + 2
                  Snack Oishi (80g){' '}
                </span>
              </td>
              <td className={'px-3 py-5'}>
                <div className={'flex items-center justify-between gap-2'}>
                  <span>0</span>
                  <span className={'cursor-pointer bg-primary p-1'}>
                    <FaPlus fill={'white'} />
                  </span>
                  <span className={'cursor-pointer bg-gray-400 p-1'}>
                    <FaMinus />
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComboComponent;
