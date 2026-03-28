import { FaBuildingColumns, FaUserGear, FaUsersGear } from 'react-icons/fa6';
import { GrMap } from 'react-icons/gr';
import {
  MdMovieEdit,
  MdOutlineDiscount,
  MdOutlinePriceChange,
  MdOutlineTheaters,
} from 'react-icons/md';
import { LuAppWindow, LuTheater, LuTicketsPlane } from 'react-icons/lu';
import { BsDiagram3, BsTags } from 'react-icons/bs';
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
        role: ['ADMIN'],
      },
      {
        name: 'Quản lý rạp',
        icon: MdOutlineTheaters,
        path: '/admin/rap',
        role: ['ADMIN'],
      },
      {
        name: 'Loại phòng chiếu',
        icon: LuAppWindow,
        path: '/admin/cinema-type',
        role: ['ADMIN', 'CADMIN'],
      },
      {
        name: 'Quản lý phòng chiếu',
        icon: LuTheater,
        path: '/admin/phong-chieu',
        role: ['ADMIN', 'CADMIN'],
      },
      {
        name: 'Thẻ thành viên',
        icon: FaRegAddressCard,
        path: '/admin/the-thanh-vien',
        role: ['ADMIN'],
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
        role: ['ADMIN'],
      },
      {
        name: 'Loại Phim',
        path: '/admin/movie-type',
        icon: BsTags,
        role: ['ADMIN'],
      },
      {
        name: 'Thể loại phim',
        path: '/admin/the-loai-phim',
        icon: BsTags,
        role: ['ADMIN'],
      },
      {
        name: 'Người tham gia',
        path: '/admin/nguoi-tham-gia',
        icon: FaUsersGear,
        role: ['ADMIN'],
      },
      {
        name: 'Vai trò phim',
        path: '/admin/vai-tro-phim',
        icon: BsDiagram3,
        role: ['ADMIN'],
      },
      {
        name: 'Người tham gia phim',
        path: '/admin/nguoi-tham-gia-phim',
        icon: FaUsersGear,
        role: ['ADMIN'],
      },
      {
        name: 'Quản lý suất chiếu',
        icon: RiSlideshow2Line,
        path: '/admin/xuat-chieu',
        role: ['CADMIN'],
      },
      {
        name: 'Biến thể suất chiếu',
        icon: BsDiagram3,
        path: '/admin/bien-the-xuat-chieu',
        role: ['CADMIN'],
      },
      {
        name: 'Quản lý hóa đơn',
        icon: PiInvoiceBold,
        path: '/admin/invoice',
        role: ['RCP'],
      },
      {
        name: 'Quản lý xuất vé',
        icon: LuTicketsPlane,
        path: '/admin/invoice-detail/abc',
        role: ['RCP'],
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
        role: ['CADMIN'],
      },
      {
        name: 'Loại đồ ăn vặt',
        path: '/admin/loai-snack',
        icon: BsTags,
        role: ['CADMIN'],
      },
      {
        name: 'Quản lý Combo',
        icon: AiOutlineProduct,
        path: '/admin/combo',
        role: ['CADMIN'],
      },
      {
        name: 'Quản lý mã giảm giá',
        icon: MdOutlineDiscount,
        path: '/admin/ma-giam-gia',
        role: ['CADMIN'],
      },
      {
        name: 'Quản lý loại vé',
        icon: MdOutlinePriceChange,
        path: '/admin/gia-ve',
        role: ['CADMIN'],
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
        role: ['ADMIN'],
      },
      {
        name: 'Quản lý vai trò',
        icon: RiShieldUserFill,
        path: '/admin/vai-tro',
        role: ['ADMIN'],
      },
      {
        name: 'Quản lý quyền hạn',
        icon: FaShieldAlt,
        path: '/admin/quyen-han',
        role: ['ADMIN'],
      },
    ],
  },
];
