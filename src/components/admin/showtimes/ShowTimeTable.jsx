import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import DataGridTable from '@component/DataGridTable';
import ImageComponent from '@component/ImageComponent';

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

const ShowTimeTable = ({ showTime }) => {
  const [openRows, setOpenRows] = useState({});

  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isOpen = !!openRows[showTime.movie.movieId];
  const rows = (showTime.showTime || []).map((item, index) => ({
    ...item,
    gridIndex: index + 1,
  }));

  const columns = [
    {
      field: 'time',
      headerName: 'Thời gian',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => `${params.row.startTime} - ${params.row.endTime}`,
    },
    {
      field: 'cinemaTheater',
      headerName: 'Phòng',
      flex: 1,
      minWidth: 160,
      renderCell: () => showTime.cinemaTheater.name,
    },
    {
      field: 'totalSeatEmpty',
      headerName: 'Còn lại',
      width: 120,
      renderCell: () => showTime.totalSeatEmpty,
    },
    {
      field: 'movieVariation',
      headerName: 'Định dạng',
      flex: 1,
      minWidth: 180,
      renderCell: () => showTime.movieVariation.name,
    },
    {
      field: 'status',
      headerName: 'Hoạt động',
      width: 140,
      renderCell: () => showTime.showTime.status,
    },
    {
      field: 'actions',
      headerName: 'Chức năng',
      width: 120,
      sortable: false,
      renderCell: () => (
        <motion.button
          className="inline-flex items-center justify-center rounded-full bg-emerald-500/90 p-2 text-white shadow hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          title="Xem"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
        >
          <EyeIcon />
        </motion.button>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-2">
      <div className="mx-auto mb-2 w-full rounded-sm bg-white p-0 shadow-sm ring-1 ring-black/5">
        <div className="border-b last:border-none">
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
                <div className="font-semibold text-gray-900">{showTime.movie.title}</div>
                <div className="text-sm text-gray-600">{showTime.movie.duration}</div>
              </div>
            </div>

            <motion.span
              className="text-sm text-gray-500"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <IoIosArrowDown />
            </motion.span>
          </button>

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
                <DataGridTable
                  rows={rows}
                  columns={columns}
                  hideFooter
                  minWidth={920}
                  getRowId={(row) => row.id}
                  emptyContent="Chưa có suất chiếu nào"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ShowTimeTable;
