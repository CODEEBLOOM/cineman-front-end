import Footer from '@component/Footer';
import Header from '@component/headers/Header';
import { IoIosArrowForward } from 'react-icons/io';

const DetailMoviePage = () => {
  return (
    <>
      <Header />
      <div className="container pb-10">
        <div className="my-4 flex items-center gap-2 md:text-[25px]">
          <p className="font-bold">Trang chủ</p>
          <span>
            <IoIosArrowForward />
          </span>
          <p className="font-bold text-primary">Elio Cậu Bé Đến Từ Trái Đất</p>
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
              Elio Cậu Bé Đến Từ Trái Đất
            </h1>
            <p className="py-3 leading-relaxed">
              Điều gì sẽ xảy ra nếu chính thứ bạn đang tìm kiếm lại tìm đến bạn
              trước? Trong cuộc phiêu lưu dở khóc dở cười trên màn ảnh rộng của
              Pixar, Elio – cậu bé mê mẩn người ngoài hành tinh – bất ngờ bị
              cuốn vào Liên Hiệp Thiên Hà, một vũ trụ liên hành tinh đầy kỳ
              diệu, nơi quy tụ các loài sinh vật thông minh khắp thiên hà. Trớ
              trêu thay, Elio lại bị hiểu nhầm là người đứng đầu Trái Đất. Giờ
              đây, cậu phải vượt qua những rắc rối mang quy mô vũ trụ, kết nối
              với những người bạn không ngờ tới, và tìm cách biến giấc mơ lớn
              nhất đời mình thành hiện thực.
            </p>
            <div>
              <div className="flex">
                <p className="w-[200px] flex-none font-bold uppercase">
                  đạo diễn
                </p>
                <p>Madeline Sharafian, Domee Shi, Adrian</p>
              </div>
              <div className="flex">
                <p className="w-[200px] flex-none font-bold uppercase">
                  Diễn viên:
                </p>
                <p>
                  Yonas Kibreab, Zoe Saldaña, Remy Edgerly, Brad Garrett, ameela
                  Jamil, Shirley Henderson
                </p>
              </div>
              <div className="flex">
                <p className="w-[200px] flex-none font-bold uppercase">
                  Thể loại:
                </p>
                <p>Hoạt hình, Phiêu lưu</p>
              </div>
              <div className="flex">
                <p className="w-[200px] flex-none font-bold uppercase">
                  Thời lượng:
                </p>
                <p>
                  <span>90</span> Phút
                </p>
              </div>
              <div className="flex">
                <p className="w-[200px] flex-none font-bold uppercase">
                  Ngôn ngữ:
                </p>
                <p>Tiếng Việt</p>
              </div>{' '}
              <div className="flex">
                <p className="w-[200px] flex-none font-bold uppercase">
                  Ngày khởi chiếu:
                </p>
                <p>27/06/2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#3c3e4d] pb-10">
        <div className="container text-center">
          <ul className="custom-border mb-10 inline-block pt-5">
            <li className="text-[30px] font-bold text-white">Trailer</li>
          </ul>
          <div className="rounded-sm border-2 border-slate-100 shadow-2xl">
            <iframe
              className="h-[60vh] w-full"
              src="https://www.youtube.com/embed/Sp_IBr3cH8g?rel=0&showinfo=0&autoplay=1"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default DetailMoviePage;
