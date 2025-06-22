import React from 'react';

const MovieTrailerComponent = ({ iframeUrl }) => {
  return (
    <div className="bg-[#3c3e4d] pb-10">
      <div className="container text-center">
        <ul className="custom-border mb-10 inline-block pt-5">
          <li className="text-[30px] font-bold text-white">Trailer</li>
        </ul>
        <div className="rounded-sm border-2 border-slate-100 shadow-2xl">
          <iframe className="h-[60vh] w-full" src={iframeUrl}></iframe>
        </div>
      </div>
    </div>
  );
};

export default MovieTrailerComponent;
