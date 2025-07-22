import { FaBuildingColumns, FaUserGear, FaUsersGear } from 'react-icons/fa6';
import { GrMap } from 'react-icons/gr';
import {
  MdMovieEdit,
  MdOutlineDiscount,
  MdOutlinePriceChange,
  MdOutlineTheaters,
} from 'react-icons/md';
import { LuTheater } from 'react-icons/lu';
import { BsDiagram3 } from 'react-icons/bs';
import { FaRegAddressCard, FaShieldAlt } from 'react-icons/fa';
import {
  RiMovie2AiLine,
  RiShieldUserFill,
  RiSlideshow2Line,
} from 'react-icons/ri';
import { PiInvoiceBold } from 'react-icons/pi';
import { IoFastFoodOutline } from 'react-icons/io5';
import { GiPopcorn } from 'react-icons/gi';
import { AiOutlineProduct } from 'react-icons/ai';

export const listMenuAdmin = [
  {
    name: 'Hệ thống rạp',
    path: '/admin/he-thong-rap',
    icon: FaBuildingColumns,
    menus: [
      {
        name: 'Quản lý chi nhánh',
        icon: GrMap,
        path: '/admin/chi-nhanh',
      },
      {
        name: 'Quản lý rạp',
        icon: MdOutlineTheaters,
        path: '/admin/rap',
      },
      {
        name: 'Quản lý phòng chiếu',
        icon: LuTheater,
        path: '/admin/phong-chieu',
      },
      {
        name: 'Sơ đồ ghế',
        icon: BsDiagram3,
        path: '/admin/so-do-ghe',
      },
      {
        name: 'Thẻ thành viên',
        icon: FaRegAddressCard,
        path: 'the-thanh-vien',
      },
    ],
  },
  {
    name: 'Phim & Suất chiếu',
    icon: RiMovie2AiLine,
    menus: [
      {
        name: 'Quản lý phim',
        path: '/admin/danh-sach-phim',
        icon: MdMovieEdit,
      },
      {
        name: 'Quản lý xuất chiếu',
        icon: RiSlideshow2Line,
        path: '/admin/xuat-chieu',
      },
      {
        name: 'Quản lý hóa đơn',
        icon: PiInvoiceBold,
        path: '/admin/hoa-don',
      },
    ],
  },
  {
    name: 'Dịch vụ & Ưu đãi',
    icon: IoFastFoodOutline,
    menus: [
      {
        name: 'Quản lý đồ ăn',
        path: '/admin/do-an',
        icon: GiPopcorn,
      },
      {
        name: 'Quản lý Combo',
        icon: AiOutlineProduct,
        path: '/admin/combo',
      },
      {
        name: 'Quản lý mã giảm giá',
        icon: MdOutlineDiscount,
        path: '/admin/ma-giam-gia',
      },
      {
        name: 'Quản lý giá vé',
        icon: MdOutlinePriceChange,
        path: '/admin/gia-ve',
      },
    ],
  },
  {
    name: 'Tài khoản & Phân quyền',
    icon: FaUsersGear,
    menus: [
      {
        name: 'Quản lý người dùng',
        path: '/admin/nguoi-dung',
        icon: FaUserGear,
      },
      {
        name: 'Quản lý vai trò',
        icon: RiShieldUserFill,
        path: '/admin/vai-tro',
      },
      {
        name: 'Quản lý quyền hạn',
        icon: FaShieldAlt,
        path: '/admin/quyen-han',
      },
    ],
  },
];
