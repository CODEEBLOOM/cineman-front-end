import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { IoIosArrowDown } from 'react-icons/io';
import ImageComponent from '@component/ImageComponent';

function Toggle({ checked, onChange }) {
  return (
    <motion.button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        checked
          ? 'bg-emerald-500 focus:ring-emerald-500'
          : 'bg-gray-300 focus:ring-gray-400'
      }`}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <motion.span
        className="inline-block h-5 w-5 rounded-full bg-white shadow"
        animate={{ x: checked ? 20 : 4 }} // 👈 trượt nút theo state
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      />
    </motion.button>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
    </svg>
  );
}

const childVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0 },
};

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04 },
  },
};

const ShowTimeTable = ({ showTime }) => {
  console.log(showTime);

  const [openRows, setOpenRows] = useState({});

  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const isOpen = !!openRows[showTime.movie.movieId];

  return (
    <div className="p-4 sm:p-2">
      <div className="mx-auto mb-2 w-full rounded-sm bg-white p-0 shadow-sm ring-1 ring-black/5">
        {
          // (showTime || []).map((item) => {

          // return (
          <div className="border-b last:border-none">
            {/* Hàng cha */}
            <button
              className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-left hover:bg-gray-50"
              onClick={() => toggleRow(showTime.movie.movieId)}
            >
              <div className="flex items-center space-x-3">
                <ImageComponent
                  className="w-[80px] animate-fade-in rounded-lg object-cover opacity-0"
                  width={100}
                  height={200}
                  src={showTime.movie.posterImage || ''}
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {showTime.movie.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {showTime.movie.duration}
                  </div>
                </div>
              </div>

              {/* Mũi tên xoay */}
              <motion.span
                className="text-sm text-gray-500"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <IoIosArrowDown />
              </motion.span>
            </button>

            {/* Bảng con có animation mở/đóng */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="subtable"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden px-4 pb-4"
                >
                  <table className="w-full border-collapse overflow-hidden rounded-sm border text-sm">
                    <thead className="bg-gray-100/70 text-xs font-semibold uppercase text-gray-600">
                      <tr>
                        <th className="p-3 text-left">Thời gian</th>
                        <th className="p-3 text-left">Phòng</th>
                        <th className="p-3 text-left">Còn lại</th>
                        <th className="p-3 text-left">Định dạng</th>
                        <th className="p-3 text-center">Hoạt động</th>
                        <th className="p-3 text-center">Chức năng</th>
                      </tr>
                    </thead>

                    {/* body có stagger từng dòng */}
                    <motion.tbody
                      variants={listVariants}
                      initial="hidden"
                      animate="show"
                    >
                      {showTime.showTime.map((s, idx) => (
                        <motion.tr
                          key={s.id}
                          variants={childVariants}
                          className={idx % 2 === 1 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="p-3">{`${s.startTime} - ${s.endTime}`}</td>
                          <td className="p-3">{showTime.cinemaTheater.name}</td>
                          <td className="p-3">{showTime.totalSeatEmpty}</td>
                          <td className="p-3">
                            {showTime.movieVariation.name}
                          </td>
                          <td className="p-3 text-center">
                            <p>{showTime.showTime.status}</p>
                          </td>
                          <td className="p-3 text-center">
                            <motion.button
                              className="inline-flex items-center justify-center rounded-full bg-emerald-500/90 p-2 text-white shadow hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                              title="Xem"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.96 }}
                            >
                              <EyeIcon />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          // );
        }
      </div>
    </div>
  );
};

export default ShowTimeTable;
