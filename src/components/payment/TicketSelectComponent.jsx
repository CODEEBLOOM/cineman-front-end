import { currencyFormatter } from '@libs/Utils';
import React from 'react';

const TicketSelectComponent = ({ ticketType, count, unitPrice }) => {
  return (
    <>
      <div className={'mt-5 flex gap-4 border-b-2 border-dashed pb-3'}>
        <h2 className={'w-[70%] flex-none text-[20px] font-bold'}>
          {ticketType}
        </h2>
        <div className={'flex flex-grow flex-wrap justify-end gap-2'}>
          <div className="text-[18px] font-medium text-pink-400">
            <span>{count}</span>
            <span>x</span>
            <span>{unitPrice}</span>
          </div>
          <div className="text-[18px] font-medium text-pink-400">
            = <span>{currencyFormatter(count * unitPrice)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketSelectComponent;
