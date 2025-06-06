const PreHeader = () => {
  return (
    <div className="bg-black">
      <div className="container flex items-end justify-end text-center text-white">
        <ul className="flex gap-5 pr-2">
          <li>
            <a href="#" className="text-[13px] hover:underline">
              Đăng nhập
            </a>
          </li>
          <li>
            <a href="#" className="text-[13px] hover:underline">
              Đăng kí
            </a>
          </li>
        </ul>
        <div className="h-6 w-6">
          <a href="#">
            <img
              src="https://toppng.com/uploads/preview/vietnam-large-flag-11547887920ptaqfn7euo.png"
              alt=""
              className="w-full object-cover"
            />
          </a>
        </div>
      </div>
    </div>
  );
};
export default PreHeader;
