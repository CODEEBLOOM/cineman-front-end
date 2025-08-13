// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Clock3, Film, BadgeInfo, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader as MUICardHeader,
  Button as MUIButton,
  Typography,
  Box,
} from '@mui/material';
import TimeBadge from './TimeBagde';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getShowTimeDetail } from '@apis/showTimeService';
import { Link } from 'react-router-dom';
import { useModelContext } from '@context/ModalContext';
import { IoClose } from 'react-icons/io5';

const MovieItem = ({ movie }) => {
  const { movieTheater } = useSelector((state) => state.movieTheater);
  const { showDateActive } = useSelector((state) => state.cinemaShowTime);
  const [showTimeDetails, setShowTimeDetails] = useState();

  const { openPopup, closeTopModal } = useModelContext();

  const renderPopup = (movie) => {
    return openPopup(
      <div className={'relative bg-white p-5'}>
        <span
          className={'absolute right-3 top-3 hover:cursor-pointer'}
          onClick={() => closeTopModal()}
        >
          <IoClose size={25} />
        </span>
        <p className={'mb-3 border-b-2 px-2 text-[20px]'}>{movie.title}</p>
        <iframe
          title={'Trailer'}
          src={movie.trailerLink}
          className={'aspect-video w-[80vw] md:w-[50vw]'}
        />
      </div>
    );
  };

  // Lấy danh sách tất cả các lịch chiếu theo showTimeSelected, movieId, movieTheaterId //
  useEffect(() => {
    if (!showDateActive && movie) return;
    getShowTimeDetail({
      movieId: movie.movieId,
      movieTheaterId: movieTheater.id,
      showDate: showDateActive,
    })
      .then((res) => {
        setShowTimeDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [showDateActive, movieTheater.id, movie]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35 }}
      className="group"
    >
      <Card className="overflow-hidden border border-transparent shadow-sm transition hover:shadow-md">
        <div className="grid grid-cols-12 gap-4 p-4">
          {/* Poster */}
          <div className="col-span-12 sm:col-span-3 md:col-span-2">
            <div className="aspect-[2/3] overflow-hidden rounded-xl bg-gray-100">
              <img
                src={movie?.posterImage}
                alt={movie?.title}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* Content */}
          <div className="col-span-12 flex flex-col gap-3 sm:col-span-9 md:col-span-10">
            <MUICardHeader
              title={
                <Link
                  to={`/detail-movie/${movie?.movieId}`}
                  className="ps-0 font-bold !leading-tight text-primary hover:cursor-pointer hover:underline md:text-2xl"
                >
                  {movie?.title}
                </Link>
              }
              className="p-0"
            />

            <Box className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1 ps-4">
                <Film size={16} />{' '}
                {(movie?.genres || [])
                  .map((genre) => genre?.name)
                  .join(',\u200B ')}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock3 size={16} /> {movie.duration} phút
              </span>
            </Box>

            {movie.format && (
              <Box className="inline-flex w-fit items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1 text-xs md:text-sm">
                <BadgeInfo size={16} /> {movie?.format}
              </Box>
            )}

            <CardContent className="p-0">
              <div className="flex flex-wrap gap-2 md:gap-3">
                {showTimeDetails?.map((showTimeDetail) => (
                  <TimeBadge
                    key={showTimeDetail.showTime.id}
                    showTimeDetail={showTimeDetail.showTime}
                  />
                ))}
              </div>
            </CardContent>

            <div className="ms-4">
              <MUIButton
                variant="text"
                endIcon={<ChevronRight size={18} />}
                sx={{ px: 0, textTransform: 'none' }}
                className="h-8"
                onClick={() => renderPopup(movie)}
              >
                Xem trailer
              </MUIButton>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MovieItem;
