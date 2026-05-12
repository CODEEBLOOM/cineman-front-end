import { Button } from '@mui/material';
import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';

const sizeClassMap = {
  xs: 'max-w-md',
  sm: 'max-w-lg',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-[calc(100vw-32px)]',
};

const resolveSizeClass = (size) => {
  if (!size) {
    return sizeClassMap.md;
  }

  return sizeClassMap[size] ?? size;
};

const AdminModal = ({
  title,
  description,
  children,
  actions,
  onClose,
  size = 'md',
  placement = 'top-center',
  className,
  bodyClassName,
  footerClassName,
  showCloseButton = true,
}) => {
  return (
    <div
      className={clsx(
        'mx-auto w-full rounded-2xl bg-white shadow-2xl',
        resolveSizeClass(size),
        className
      )}
      data-modal-placement={placement}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>

        {showCloseButton ? (
          <Button
            type="button"
            onClick={onClose}
            color="inherit"
            className="!min-w-0 !rounded-full !p-2"
          >
            <IoClose size={20} />
          </Button>
        ) : null}
      </div>

      <div
        className={clsx(
          'max-h-[calc(100vh-220px)] overflow-y-auto px-5 py-4 sm:px-6',
          bodyClassName
        )}
      >
        {children}
      </div>

      {actions ? (
        <div
          className={clsx(
            'flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 px-5 py-4 sm:px-6',
            footerClassName
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
};

export default AdminModal;
