import { createRole, updateRole } from '@apis/roleService';
import AdminModal from '@component/admin/common/AdminModal';
import FormField from '@component/FormField';
import TextInput from '@component/form_field/TextInput';
import { useModelContext } from '@context/ModalContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Checkbox, FormHelperText } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as yup from 'yup';

const uniqueNumberList = (values) => {
  const normalizedValues = (Array.isArray(values) ? values : [])
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value > 0);

  return Array.from(new Set(normalizedValues));
};

const normalizeKeyword = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const toTitleCase = (value) =>
  String(value ?? '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

const resolvePermissionGroupLabel = (permission) => {
  if (permission?.category?.trim()) {
    return permission.category.trim();
  }

  const urlSegments = String(permission?.url ?? '')
    .split('/')
    .filter(Boolean);

  if (urlSegments.length === 0) {
    return 'Khác';
  }

  const preferredSegment =
    urlSegments[0]?.toLowerCase() === 'admin'
      ? urlSegments[1] ?? urlSegments[0]
      : urlSegments[0];

  return toTitleCase(preferredSegment) || 'Khác';
};

const matchesPermissionKeyword = (permission, keyword) => {
  const normalizedKeyword = normalizeKeyword(keyword);

  if (!normalizedKeyword) {
    return true;
  }

  const searchableText = [
    permission?.title,
    permission?.method,
    permission?.url,
    permission?.description,
    permission?.groupLabel,
  ]
    .map((value) => normalizeKeyword(value))
    .join(' ');

  return searchableText.includes(normalizedKeyword);
};

const sortPermissions = (permissions) =>
  [...permissions].sort((left, right) => {
    const leftMethod = String(left?.method ?? '');
    const rightMethod = String(right?.method ?? '');
    const methodCompare = leftMethod.localeCompare(rightMethod, 'vi');

    if (methodCompare !== 0) {
      return methodCompare;
    }

    const titleCompare = String(left?.title ?? '').localeCompare(
      String(right?.title ?? ''),
      'vi'
    );

    if (titleCompare !== 0) {
      return titleCompare;
    }

    return String(left?.url ?? '').localeCompare(String(right?.url ?? ''), 'vi');
  });

const formSchema = yup.object({
  roleId: yup
    .string()
    .trim()
    .required('Mã vai trò không được để trống!')
    .max(25, 'Mã vai trò phải nhỏ hơn hoặc bằng 25 ký tự!'),
  name: yup
    .string()
    .trim()
    .required('Tên vai trò không được để trống!')
    .max(100, 'Tên vai trò phải nhỏ hơn hoặc bằng 100 ký tự!'),
  permissionIds: yup.array().default([]),
});

const RoleFormModal = ({
  role,
  permissions = [],
  onSuccess,
  placement = 'top-center',
}) => {
  const { closeTopModal } = useModelContext();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const roleId = role?.roleId ?? '';
  const isEditing = Boolean(roleId);
  const formId = 'role-form';

  const normalizedPermissions = useMemo(
    () =>
      sortPermissions(
        permissions
          .filter((permission) => permission?.id)
          .map((permission) => ({
            ...permission,
            id: String(permission.id),
            groupLabel: resolvePermissionGroupLabel(permission),
          }))
      ),
    [permissions]
  );

  const permissionGroups = useMemo(() => {
    const groupMap = normalizedPermissions.reduce((result, permission) => {
      const groupKey = permission.groupLabel || 'Khác';

      if (!result[groupKey]) {
        result[groupKey] = [];
      }

      result[groupKey].push(permission);
      return result;
    }, {});

    return Object.entries(groupMap)
      .sort(([left], [right]) => left.localeCompare(right, 'vi'))
      .map(([groupLabel, items]) => ({
        groupLabel,
        items,
      }));
  }, [normalizedPermissions]);

  const permissionIdSet = useMemo(
    () => new Set(normalizedPermissions.map((permission) => permission.id)),
    [normalizedPermissions]
  );

  const defaultValues = useMemo(
    () => ({
      roleId: '',
      name: '',
      permissionIds: [],
    }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  const selectedPermissionIds = watch('permissionIds') ?? [];
  const selectedPermissionIdSet = useMemo(
    () => new Set((Array.isArray(selectedPermissionIds) ? selectedPermissionIds : []).map(String)),
    [selectedPermissionIds]
  );

  const filteredPermissionGroups = useMemo(
    () =>
      permissionGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((permission) => {
            if (showSelectedOnly && !selectedPermissionIdSet.has(permission.id)) {
              return false;
            }

            return matchesPermissionKeyword(permission, searchKeyword);
          }),
        }))
        .filter((group) => group.items.length > 0),
    [permissionGroups, searchKeyword, selectedPermissionIdSet, showSelectedOnly]
  );

  const visiblePermissionIds = useMemo(
    () => filteredPermissionGroups.flatMap((group) => group.items.map((permission) => permission.id)),
    [filteredPermissionGroups]
  );

  const hiddenSelectedPermissionCount = useMemo(
    () =>
      (Array.isArray(selectedPermissionIds) ? selectedPermissionIds : []).filter(
        (permissionId) => !permissionIdSet.has(String(permissionId))
      ).length,
    [permissionIdSet, selectedPermissionIds]
  );

  const selectedVisiblePermissionCount = useMemo(
    () =>
      visiblePermissionIds.filter((permissionId) => selectedPermissionIdSet.has(permissionId)).length,
    [selectedPermissionIdSet, visiblePermissionIds]
  );

  const isAllVisibleSelected =
    visiblePermissionIds.length > 0 &&
    selectedVisiblePermissionCount === visiblePermissionIds.length;
  const isPartiallyVisibleSelected =
    selectedVisiblePermissionCount > 0 &&
    selectedVisiblePermissionCount < visiblePermissionIds.length;

  useEffect(() => {
    reset({
      roleId: role?.roleId ?? '',
      name: role?.name ?? '',
      permissionIds: (role?.permissionIds ?? []).map((value) => String(value)),
    });
  }, [role, reset]);

  useEffect(() => {
    setSearchKeyword('');
    setShowSelectedOnly(false);
  }, [roleId]);

  const updatePermissionIds = (nextPermissionIds) => {
    setValue(
      'permissionIds',
      Array.from(new Set((Array.isArray(nextPermissionIds) ? nextPermissionIds : []).map(String))),
      {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      }
    );
  };

  const togglePermission = (permissionId, checked) => {
    const nextPermissionIds = new Set(selectedPermissionIdSet);

    if (checked) {
      nextPermissionIds.add(String(permissionId));
    } else {
      nextPermissionIds.delete(String(permissionId));
    }

    updatePermissionIds(Array.from(nextPermissionIds));
  };

  const togglePermissionBatch = (permissionIds, checked) => {
    const nextPermissionIds = new Set(selectedPermissionIdSet);

    permissionIds.forEach((permissionId) => {
      if (checked) {
        nextPermissionIds.add(String(permissionId));
      } else {
        nextPermissionIds.delete(String(permissionId));
      }
    });

    updatePermissionIds(Array.from(nextPermissionIds));
  };

  const handleReset = () => {
    reset({
      roleId: role?.roleId ?? '',
      name: role?.name ?? '',
      permissionIds: (role?.permissionIds ?? []).map((value) => String(value)),
    });
    setSearchKeyword('');
    setShowSelectedOnly(false);
  };

  const onSubmit = async (value) => {
    try {
      const payload = {
        roleId: value.roleId.trim(),
        name: value.name.trim(),
        permissionIds: uniqueNumberList(value.permissionIds),
      };

      if (isEditing) {
        await updateRole(roleId, payload);
        toast.success('Cập nhật vai trò thành công!');
      } else {
        await createRole(payload);
        toast.success('Tạo vai trò thành công!');
      }

      await onSuccess?.();
      closeTopModal();
    } catch (error) {
      if (
        error?.response?.status === 400 ||
        error?.response?.status === 404 ||
        error?.response?.status === 409
      ) {
        return toast.error(error?.response?.data?.message);
      }

      toast.error(isEditing ? 'Cập nhật vai trò thất bại!' : 'Tạo vai trò thất bại!');
    }
  };

  return (
    <AdminModal
      title={isEditing ? 'Cập nhật vai trò' : 'Tạo vai trò'}
      description="Thiết lập mã vai trò, tên hiển thị và tick nhanh các permission theo từng nhóm để quản trị dễ hơn."
      onClose={closeTopModal}
      size="xl"
      placement={placement}
      actions={
        <>
          <Button
            type="button"
            variant="outlined"
            color="info"
            onClick={handleReset}
          >
            Làm mới
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="warning"
            onClick={closeTopModal}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="contained"
            disabled={isSubmitting}
          >
            {isEditing ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </>
      }
    >
      <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-800">
        Mỗi vai trò sẽ được gắn theo danh sách permission cụ thể. Bạn có thể tìm kiếm,
        lọc các quyền đã chọn, chọn toàn bộ phần đang hiển thị hoặc tick nhanh theo từng
        nhóm chức năng.
      </div>

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            name="roleId"
            require={true}
            label="Mã vai trò"
            control={control}
            Component={TextInput}
            placeHolder="VD: ADMIN, CADMIN, RCP"
            error={errors.roleId}
            disabled={isEditing}
          />

          <FormField
            name="name"
            require={true}
            label="Tên vai trò"
            control={control}
            Component={TextInput}
            placeHolder="VD: Quản trị viên, Quản lý chi nhánh"
            error={errors.name}
          />
        </div>

        <div className="mt-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-small text-dark-100 mb-1 font-medium">Danh sách quyền</p>
              <p className="text-sm text-slate-500">
                Đã chọn {selectedPermissionIdSet.size} / {normalizedPermissions.length} quyền
                {hiddenSelectedPermissionCount > 0
                  ? `, trong đó ${hiddenSelectedPermissionCount} quyền không còn xuất hiện trong danh sách hiện tại`
                  : ''}
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                Hiển thị {visiblePermissionIds.length} quyền
              </span>
              <span className="rounded-full bg-sky-100 px-3 py-1 font-medium text-sky-700">
                Đang tick {selectedVisiblePermissionCount} quyền trong vùng lọc
              </span>
            </div>
          </div>

          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              <input
                type="text"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="Tìm theo tên quyền, method, URL hoặc mô tả..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
              />

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant={showSelectedOnly ? 'contained' : 'outlined'}
                  onClick={() => setShowSelectedOnly((currentValue) => !currentValue)}
                >
                  {showSelectedOnly ? 'Đang xem quyền đã chọn' : 'Chỉ xem quyền đã chọn'}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => togglePermissionBatch(visiblePermissionIds, true)}
                  disabled={visiblePermissionIds.length === 0 || isAllVisibleSelected}
                >
                  Chọn tất cả đang lọc
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="warning"
                  onClick={() => togglePermissionBatch(visiblePermissionIds, false)}
                  disabled={selectedVisiblePermissionCount === 0}
                >
                  Bỏ chọn đang lọc
                </Button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Checkbox
                  checked={isAllVisibleSelected}
                  indeterminate={isPartiallyVisibleSelected}
                  onChange={(event) =>
                    togglePermissionBatch(visiblePermissionIds, event.target.checked)
                  }
                  disabled={visiblePermissionIds.length === 0}
                  size="small"
                />
                <span>Tick nhanh toàn bộ danh sách đang hiển thị</span>
              </label>

              {searchKeyword ? (
                <button
                  type="button"
                  className="rounded-lg px-2 py-1 font-medium text-sky-700 transition hover:bg-sky-50"
                  onClick={() => setSearchKeyword('')}
                >
                  Xóa từ khóa lọc
                </button>
              ) : null}
            </div>
          </div>

          {filteredPermissionGroups.length > 0 ? (
            <div className="space-y-4">
              {filteredPermissionGroups.map((group) => {
                const groupPermissionIds = group.items.map((permission) => permission.id);
                const selectedGroupCount = groupPermissionIds.filter((permissionId) =>
                  selectedPermissionIdSet.has(permissionId)
                ).length;
                const isAllGroupSelected =
                  groupPermissionIds.length > 0 &&
                  selectedGroupCount === groupPermissionIds.length;
                const isPartiallyGroupSelected =
                  selectedGroupCount > 0 && selectedGroupCount < groupPermissionIds.length;

                return (
                  <div
                    key={group.groupLabel}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">
                          {group.groupLabel}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {selectedGroupCount} / {group.items.length} quyền đang được chọn
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                          <Checkbox
                            checked={isAllGroupSelected}
                            indeterminate={isPartiallyGroupSelected}
                            onChange={(event) =>
                              togglePermissionBatch(groupPermissionIds, event.target.checked)
                            }
                            size="small"
                          />
                          <span>Tick cả nhóm</span>
                        </label>

                        <Button
                          type="button"
                          variant="outlined"
                          size="small"
                          onClick={() => togglePermissionBatch(groupPermissionIds, true)}
                          disabled={isAllGroupSelected}
                        >
                          Chọn nhóm
                        </Button>
                        <Button
                          type="button"
                          variant="outlined"
                          size="small"
                          color="warning"
                          onClick={() => togglePermissionBatch(groupPermissionIds, false)}
                          disabled={selectedGroupCount === 0}
                        >
                          Bỏ nhóm
                        </Button>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {group.items.map((permission) => {
                        const isSelected = selectedPermissionIdSet.has(permission.id);

                        return (
                          <label
                            key={permission.id}
                            className={`flex cursor-pointer gap-3 px-4 py-3 transition ${
                              isSelected ? 'bg-sky-50/70' : 'bg-white hover:bg-slate-50'
                            }`}
                          >
                            <Checkbox
                              checked={isSelected}
                              onChange={(event) =>
                                togglePermission(permission.id, event.target.checked)
                              }
                              sx={{ mt: '-2px' }}
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-slate-900">
                                  {permission.title || `Permission #${permission.id}`}
                                </p>
                                {permission.method ? (
                                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                                    {permission.method}
                                  </span>
                                ) : null}
                              </div>

                              <p className="mt-1 break-all text-sm text-slate-600">
                                {permission.url || 'Chưa có endpoint'}
                              </p>

                              {permission.description ? (
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                  {permission.description}
                                </p>
                              ) : null}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              {normalizedPermissions.length === 0
                ? 'Chưa có dữ liệu permission để gán cho vai trò này.'
                : 'Không có permission nào khớp với bộ lọc hiện tại.'}
            </div>
          )}

          {errors.permissionIds ? (
            <FormHelperText error={true} className="!mt-2 !text-[14px]">
              {errors.permissionIds.message}
            </FormHelperText>
          ) : null}
        </div>
      </form>
    </AdminModal>
  );
};

export default RoleFormModal;
