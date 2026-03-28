import CustomBreadcrumb from '@component/CustomBreakcrumb';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { LuAppWindow, LuMapPinned, LuTheater } from 'react-icons/lu';
import { MdOutlineTheaters } from 'react-icons/md';

const allCards = [
  {
    title: 'Quản lý chi nhánh',
    description:
      'Tạo danh mục tỉnh/thành và vùng vận hành để gắn rạp theo khu vực.',
    path: '/admin/chi-nhanh',
    roles: ['ADMIN'],
    icon: LuMapPinned,
  },
  {
    title: 'Quản lý rạp',
    description:
      'Quản lý tên rạp, địa chỉ, hotline và chi nhánh mà rạp đang trực thuộc.',
    path: '/admin/rap',
    roles: ['ADMIN'],
    icon: MdOutlineTheaters,
  },
  {
    title: 'Loại phòng chiếu',
    description:
      'Quản lý loại phòng chiếu như 2D, 3D, IMAX hoặc các cấu hình phòng chuyên biệt khác.',
    path: '/admin/cinema-type',
    roles: ['ADMIN', 'CADMIN'],
    icon: LuAppWindow,
  },
  {
    title: 'Quản lý phòng chiếu',
    description:
      'Cấu hình sơ đồ ghế, loại phòng và số lượng hàng ghế cho từng phòng chiếu.',
    path: '/admin/phong-chieu',
    roles: ['ADMIN', 'CADMIN'],
    icon: LuTheater,
  },
];

const TheaterSystemPage = () => {
  const { user } = useSelector((state) => state.user);
  const roleIds = user?.roles?.map((role) => role.roleId) ?? [];
  const visibleCards = allCards.filter((card) =>
    card.roles.some((role) => roleIds.includes(role))
  );

  return (
    <div>
      <CustomBreadcrumb
        items={[{ label: 'Hệ thống rạp' }]}
        title="Hệ thống rạp"
      />

      <div className="mx-5 mt-3 rounded-sm bg-white px-4 py-4">
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold">Điều hướng nhanh</h2>
          <p className="mt-1 text-sm text-slate-500">
            Chọn khu vực quản trị phù hợp với quyền hiện tại của bạn để thao tác
            nhanh hơn.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.path}
                to={card.path}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {card.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {card.description}
                    </p>
                    <p className="mt-4 text-sm font-medium text-blue-700 group-hover:underline">
                      Mở quản lý
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TheaterSystemPage;
