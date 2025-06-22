import React from 'react';
import { IoIosArrowForward } from 'react-icons/io';

const MovieInfoDetailComponent = ({ movie = {} }) => {
  return (
    <div className="container pb-10">
      <div className="my-4 flex items-center gap-2 md:text-[25px]">
        <p className="font-bold">Trang chủ</p>
        <span>
          <IoIosArrowForward />
        </span>
        <p className="font-bold text-primary">{movie?.title}</p>
      </div>
      <div className="gap-8 md:flex">
        <div className="w-[260px] flex-none rounded-2xl">
          <img
            src="/film-05.jpg"
            alt=""
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>
        <div className="flex-1">
          <h1 className="mb-2 text-[25px] font-bold md:text-4xl">
            {movie?.title}
          </h1>
          <p className="py-3 leading-relaxed">{movie?.detailDescription}</p>
          <div>
            <div className="flex">
              <p className="w-[200px] flex-none font-bold uppercase">
                đạo diễn
              </p>
              {(movie?.directors || [])
                .map((director) => director.nickname)
                .join(',')}
            </div>
            <div className="flex">
              <p className="w-[200px] flex-none font-bold uppercase">
                Diễn viên:
              </p>
              {(movie?.casts || []).map((cast) => cast.nickname).join(',')}
            </div>
            <div className="flex">
              <p className="w-[200px] flex-none font-bold uppercase">
                Thể loại:
              </p>
              {(movie?.genres || []).map((genre) => genre.name).join(',')}
            </div>
            <div className="flex">
              <p className="w-[200px] flex-none font-bold uppercase">
                Thời lượng:
              </p>
              <p>
                <span>{movie?.duration}</span> Phút
              </p>
            </div>
            <div className="flex">
              <p className="w-[200px] flex-none font-bold uppercase">
                Ngôn ngữ:
              </p>
              <p>{movie?.language}</p>
            </div>{' '}
            <div className="flex">
              <p className="w-[200px] flex-none font-bold uppercase">
                Ngày khởi chiếu:
              </p>
              <p>{}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfoDetailComponent;
