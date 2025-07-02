import { getSeatMap, published } from '@apis/cinemaTheaterService';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import SeatGrid from './SeatGrid';
import { RxCross1 } from 'react-icons/rx';

const SeatMap = () => {
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [cinemaTheater, setCinemaTheater] = useState({});
  const { id } = useParams();
  const fetchSeatMap = () => {
    getSeatMap(id)
      .then((res) => {
        const { seats, ...restData } = res.data;
        setSeats(seats);
        setCinemaTheater(restData);
      })
      .catch((error) => console.log(error));
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchSeatMap();
  }, []);

  const handlePublishedCinemaTheater = () => {
    published(id)
      .then((res) => {
        fetchSeatMap();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="grid gap-4 p-10 lg:grid-cols-12">
      <div className="col-span-12 rounded-md bg-white p-5 lg:col-span-9">
        <div className="border-b-2 pb-2">
          <p className="text-[18px] font-medium">Sơ đồ ghế</p>
        </div>
        <div className="mx-auto mt-5 max-w-[800px] overflow-x-auto">
          <SeatGrid
            seats={seats}
            cinemaTheater={cinemaTheater}
            fetchSeatMap={fetchSeatMap}
          />
        </div>
      </div>
      <div className="col-span-12 flex flex-col space-y-6 lg:col-span-3">
        <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
          <div className="border-b-2 pb-2">
            <p className="text-[18px] font-medium">Cập nhật</p>
          </div>
          <p>
            <span className="font-medium">Trạng thái: </span>
            {cinemaTheater?.status}
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate('/admin/phong-chieu')}
            >
              Quay lại
            </Button>
            {cinemaTheater?.status !== 'PUBLISHED' && (
              <Button
                variant="contained"
                color="primary"
                onClick={handlePublishedCinemaTheater}
              >
                Xuất bản
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
          <div className="border-b-2 pb-2">
            <p className="text-[18px] font-medium">Chú thích theo loại ghế</p>
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế thường</p>
            <svg
              width="50px"
              height="50px"
              viewBox="0 0 24 24"
              fill="#caccc9"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.7497 12.75C20.7166 8.86578 21.1456 6.84737 20.134 5.42821C20.0665 5.33345 19.9948 5.24169 19.9193 5.15317C18.7216 3.75 16.4811 3.75 11.9999 3.75C7.5188 3.75 5.27824 3.75 4.08059 5.15317C4.00504 5.24169 3.93339 5.33345 3.86584 5.42821C2.85424 6.84737 3.28329 8.86578 4.25017 12.75H19.7497Z"
                fill="#caccc9"
              />
              <path
                d="M4.75 17.75V19.75C4.75 20.1642 4.41421 20.5 4 20.5C3.58579 20.5 3.25 20.1642 3.25 19.75V17.6046C2.51704 17.3079 2 16.5893 2 15.75C2 14.6454 2.89543 13.75 4 13.75H20C21.1046 13.75 22 14.6454 22 15.75C22 16.5893 21.483 17.3079 20.75 17.6046V19.75C20.75 20.1642 20.4142 20.5 20 20.5C19.5858 20.5 19.25 20.1642 19.25 19.75V17.75H4.75Z"
                fill="#caccc9"
              />
            </svg>
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế VIP</p>
            <svg
              height="50px"
              width="50px"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 25.626 25.626"
              xmlSpace="preserve"
            >
              <g>
                <path
                  style={{ fill: '#caccc9' }}
                  d="M20.813,22.22c-0.551,0-1-0.449-1-1v-1h1c1.594,0,2-0.542,2-0.542v1.542c0,0.551-0.449,1-1,1H20.813
		z"
                />
                <path
                  style={{ fill: '#caccc9' }}
                  d="M3.813,22.22c-0.551,0-1-0.449-1-1v-1.542c0,0,0.406,0.542,2,0.542h1v1c0,0.551-0.449,1-1,1H3.813z"
                />
                <g>
                  <path
                    style={{ fill: '#caccc9' }}
                    d="M25.626,11.72c0-1.277-1.036-2.313-2.313-2.313c-0.992,0-1.832,0.628-2.16,1.506l-1.097,2.457
			c-0.082-0.051-3.399-1.093-7.181-1.093s-7.23,1.047-7.314,1.099l-1.039-2.305c-0.281-0.958-1.159-1.663-2.209-1.663
			C1.036,9.408,0,10.443,0,11.721c0,1.063,0.722,1.949,1.699,2.22l0.428,3.679c0.452,1.561,2.686,1.6,2.686,1.6h16
			c0,0,2.234-0.039,2.686-1.602l0.428-3.679C24.903,13.669,25.626,12.783,25.626,11.72z"
                  />
                </g>
                <path
                  style={{ fill: '#caccc9' }}
                  d="M2.313,8.207c1.512,0,2.869,0.998,3.334,2.438l0.506,1.125c0.979-0.353,4.499-0.693,6.723-0.693
		c2.163,0,5.633,0.316,6.593,0.666l0.575-1.289c0.521-1.346,1.83-2.247,3.27-2.247c0.106,0,0.207,0.022,0.312,0.031
		c0-0.006,0.001-0.013,0.001-0.019c0-2.658-2.154-4.813-4.813-4.813c-0.334,0-11.666,0-12,0c-2.658,0-4.813,2.154-4.813,4.813
		c0,0.006,0.001,0.013,0.001,0.019C2.106,8.23,2.207,8.207,2.313,8.207z"
                />
              </g>
            </svg>
          </div>
          <div className="flex items-center justify-between">
            <p>Ghế đôi</p>
            <div className="flex">
              <svg
                fill="#caccc9"
                height="60px"
                width="60px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 510.344 510.344"
                xmlSpace="preserve"
              >
                <g>
                  <g>
                    <path
                      d="M440.928,139.177H273.412c-4.408,0-13.652-0.408-13.652,4v104c0,4.412,9.244,12,13.652,12H435.76v-36
			c0-9.384,4-18.072,8-25.22v-54.78C443.76,138.769,445.344,139.177,440.928,139.177z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon points="259.76,275.177 259.76,299.177 440.904,299.177 440.928,275.177 		" />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon points="67.76,275.177 67.76,299.177 249.388,299.177 249.412,275.177 		" />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M482.344,195.177c-15.436,0-30.584,12.56-30.584,28v48v4v20c0,8.824-2.008,20-10.832,20H73.412
			c-8.82,0-21.652-11.176-21.652-20v-20v-4v-48c0-15.44-9.736-28-25.176-28c-15.436,0-26.584,12.56-26.584,28
			c0,10.672,3.844,20.272,13.444,25.052c2.72,1.352,2.316,4.124,2.316,7.16v59.788c0,10.424,8,19.296,16,22.6v25.4
			c0,2.208,7.448,8,9.652,8h428.224c2.208,0,2.124-5.792,2.124-8v-25.4c8-3.304,16-12.172,16-22.6v-59.788
			c0-3.036,4.3-5.808,7.02-7.164c9.596-4.776,15.564-14.38,15.564-25.052C510.344,207.737,497.784,195.177,482.344,195.177z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M243.76,143.177c0-4.408,2.068-4-2.348-4h-168c-4.408,0-13.652-0.408-13.652,4v54.78c4,7.148,8,15.836,8,25.22v36h173.652
			c4.416,0,2.348-7.588,2.348-12V143.177z"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
        {cinemaTheater.status !== 'PUBLISHED' && (
          <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
            <div className="border-b-2 pb-2">
              <p className="text-[18px] font-medium">Chú thích theo bảng màu</p>
            </div>
            <div className="flex items-center justify-between">
              <p>Ghế thường</p>
              <div className="h-[35px] w-[35px] border bg-[#fbf5e7] shadow-md"></div>
            </div>
            <div className="flex items-center justify-between">
              <p>Ghế VIP</p>
              <div className="h-[35px] w-[35px] border bg-[#fbfdfc] shadow-md"></div>
            </div>
            <div className="flex items-center justify-between">
              <p>Ghế đôi</p>
              <div className="h-[35px] w-[35px] border bg-red-200 shadow-md"></div>
            </div>
          </div>
        )}
        {/* Trạng thái ghế */}
        {cinemaTheater.status === 'PUBLISHED' && (
          <div className="flex flex-col space-y-5 rounded-md bg-white p-5">
            <div className="border-b-2 pb-2">
              <p className="text-[18px] font-medium">
                Chú thích trạng thái ghế
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p>Hoạt động ( Active )</p>
              <svg
                fill="#caccc9"
                height="60px"
                width="60px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 510.344 510.344"
                xmlSpace="preserve"
              >
                <g>
                  <g>
                    <path
                      d="M440.928,139.177H273.412c-4.408,0-13.652-0.408-13.652,4v104c0,4.412,9.244,12,13.652,12H435.76v-36
			c0-9.384,4-18.072,8-25.22v-54.78C443.76,138.769,445.344,139.177,440.928,139.177z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon points="259.76,275.177 259.76,299.177 440.904,299.177 440.928,275.177 		" />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon points="67.76,275.177 67.76,299.177 249.388,299.177 249.412,275.177 		" />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M482.344,195.177c-15.436,0-30.584,12.56-30.584,28v48v4v20c0,8.824-2.008,20-10.832,20H73.412
			c-8.82,0-21.652-11.176-21.652-20v-20v-4v-48c0-15.44-9.736-28-25.176-28c-15.436,0-26.584,12.56-26.584,28
			c0,10.672,3.844,20.272,13.444,25.052c2.72,1.352,2.316,4.124,2.316,7.16v59.788c0,10.424,8,19.296,16,22.6v25.4
			c0,2.208,7.448,8,9.652,8h428.224c2.208,0,2.124-5.792,2.124-8v-25.4c8-3.304,16-12.172,16-22.6v-59.788
			c0-3.036,4.3-5.808,7.02-7.164c9.596-4.776,15.564-14.38,15.564-25.052C510.344,207.737,497.784,195.177,482.344,195.177z"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <path
                      d="M243.76,143.177c0-4.408,2.068-4-2.348-4h-168c-4.408,0-13.652-0.408-13.652,4v54.78c4,7.148,8,15.836,8,25.22v36h173.652
			c4.416,0,2.348-7.588,2.348-12V143.177z"
                    />
                  </g>
                </g>
              </svg>
            </div>
            <div className="flex items-center justify-between">
              <p>Ngưng hoạt động (Inactive )</p>
              <div className="relative">
                <div className="flex">
                  <svg
                    fill="#caccc9"
                    height="60px"
                    width="60px"
                    version="1.1"
                    id="Layer_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 510.344 510.344"
                    xmlSpace="preserve"
                  >
                    <g>
                      <g>
                        <path
                          d="M440.928,139.177H273.412c-4.408,0-13.652-0.408-13.652,4v104c0,4.412,9.244,12,13.652,12H435.76v-36
                  c0-9.384,4-18.072,8-25.22v-54.78C443.76,138.769,445.344,139.177,440.928,139.177z"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <polygon points="259.76,275.177 259.76,299.177 440.904,299.177 440.928,275.177 		" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <polygon points="67.76,275.177 67.76,299.177 249.388,299.177 249.412,275.177 		" />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path
                          d="M482.344,195.177c-15.436,0-30.584,12.56-30.584,28v48v4v20c0,8.824-2.008,20-10.832,20H73.412
                  c-8.82,0-21.652-11.176-21.652-20v-20v-4v-48c0-15.44-9.736-28-25.176-28c-15.436,0-26.584,12.56-26.584,28
                  c0,10.672,3.844,20.272,13.444,25.052c2.72,1.352,2.316,4.124,2.316,7.16v59.788c0,10.424,8,19.296,16,22.6v25.4
                  c0,2.208,7.448,8,9.652,8h428.224c2.208,0,2.124-5.792,2.124-8v-25.4c8-3.304,16-12.172,16-22.6v-59.788
                  c0-3.036,4.3-5.808,7.02-7.164c9.596-4.776,15.564-14.38,15.564-25.052C510.344,207.737,497.784,195.177,482.344,195.177z"
                        />
                      </g>
                    </g>
                    <g>
                      <g>
                        <path
                          d="M243.76,143.177c0-4.408,2.068-4-2.348-4h-168c-4.408,0-13.652-0.408-13.652,4v54.78c4,7.148,8,15.836,8,25.22v36h173.652
                  c4.416,0,2.348-7.588,2.348-12V143.177z"
                        />
                      </g>
                    </g>
                  </svg>
                </div>
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                  <RxCross1 size={35} color="red" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default SeatMap;
