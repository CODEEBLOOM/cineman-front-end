import { QRCodeCanvas } from 'qrcode.react';
import React from 'react';

const QRGenerator = ({ text }) => {
  return (
    <>
      <div className="flex justify-center">
        <QRCodeCanvas
          value={text}
          size={150}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H" // độ chịu lỗi: L, M, Q, H
          includeMargin={true}
        />
      </div>
      <p className="text-center">{text}</p>
    </>
  );
};

export default QRGenerator;
