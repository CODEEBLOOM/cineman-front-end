import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Link as MUILink,
  Typography,
  Chip,
  useMediaQuery,
} from '@mui/material';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import { MdDashboardCustomize } from 'react-icons/md';

/**
 * Breadcrumb component using MUI + Tailwind.
 * - Works with react-router (pass `linkComponent={RouterLink}`) or plain anchors.
 * - Responsive: auto-collapses on small screens.
 * - Accessible and SEO-friendly (uses <nav aria-label="breadcrumb">).
 */
const CustomBreadcrumb = ({ ...props }) => {
  const {
    items,
    className,
    separator = <ChevronRightRounded fontSize="small" />,
    maxItems,
    itemsAfterCollapse = 1,
    itemsBeforeCollapse = 1,
    linkComponent,
    uppercase = false,
    showHome = true,
    title = '',
  } = props;

  const isSmall = useMediaQuery('(max-width: 640px)'); // Tailwind sm breakpoint
  const effectiveMax =
    typeof maxItems === 'number' ? maxItems : isSmall ? 3 : 6;

  const LinkCmp = linkComponent || MUILink;

  // Normalize: prepend Home item if requested
  const normalized = React.useMemo(() => {
    if (!showHome) return items;
    const hasHome = items[0]?.isHome;
    if (hasHome) return items;
    return [
      {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: <MdDashboardCustomize fontSize="small" />,
        isHome: true,
      },
      ...items,
    ];
  }, [items, showHome]);

  return (
    <nav aria-label="breadcrumb" className={clsx('w-full', className)}>
      <div
        className={clsx(
          'flex items-center justify-between gap-2',
          'border border-gray-200',
          'bg-white/60 backdrop-blur',
          'px-6 py-2 shadow-sm'
        )}
      >
        <div>
          <p className="font-semibold uppercase">{title}</p>
        </div>
        <Breadcrumbs
          separator={separator}
          maxItems={effectiveMax}
          itemsAfterCollapse={itemsAfterCollapse}
          itemsBeforeCollapse={itemsBeforeCollapse}
          aria-label="breadcrumbs"
          classes={{ li: 'flex items-center' }}
        >
          {normalized.map((item, idx) => {
            const isLast = idx === normalized.length - 1;
            const common = {
              className: clsx(
                'inline-flex items-center gap-1.5',
                uppercase && 'uppercase tracking-wide',
                !isLast && 'hover:underline'
              ),
              sx: {
                fontSize: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
              },
            };

            if (isLast || item.disabled) {
              return (
                <Typography key={idx} color="text.primary" {...common}>
                  {item.icon}
                  <span className="max-w-[18ch] truncate sm:max-w-none">
                    {item.label}
                  </span>
                  {item.tag && (
                    <Chip size="small" label={item.tag} className="ml-1" />
                  )}
                </Typography>
              );
            }

            const linkProps = item.href
              ? { to: item.href, href: item.href }
              : {};

            return (
              <LinkCmp
                key={idx}
                {...linkProps}
                onClick={item.onClick}
                underline="hover"
                color="inherit"
                {...common}
              >
                {item.icon}
                <span className="max-w-[18ch] truncate sm:max-w-none">
                  {item.label}
                </span>
              </LinkCmp>
            );
          })}
        </Breadcrumbs>
      </div>
    </nav>
  );
};

CustomBreadcrumb.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      href: PropTypes.string,
      icon: PropTypes.node,
      onClick: PropTypes.func,
      disabled: PropTypes.bool,
      isHome: PropTypes.bool,
      tag: PropTypes.string,
    })
  ).isRequired,
  className: PropTypes.string,
  separator: PropTypes.node,
  maxItems: PropTypes.number,
  itemsAfterCollapse: PropTypes.number,
  itemsBeforeCollapse: PropTypes.number,
  linkComponent: PropTypes.elementType, // e.g., RouterLink from react-router
  uppercase: PropTypes.bool,
  showHome: PropTypes.bool,
};

export default CustomBreadcrumb;

/**
 * ---------------- Example usage ----------------
 *
 * import { Link as RouterLink } from 'react-router-dom';
 * import FolderRounded from '@mui/icons-material/FolderRounded';
 * import ArticleRounded from '@mui/icons-material/ArticleRounded';
 *
 * <Breadcrumb
 *   className="mb-4"
 *   linkComponent={RouterLink}
 *   items={[
 *     { label: 'Thư viện', href: '/library', icon: <FolderRounded fontSize="small" /> },
 *     { label: 'Bài viết', href: '/library/articles', icon: <ArticleRounded fontSize="small" /> },
 *     { label: 'Chi tiết', icon: <ArticleRounded fontSize="small" /> },
 *   ]}
 * />
 */
