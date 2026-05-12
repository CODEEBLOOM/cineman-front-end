import EmptyList from '@component/cinema_showtime/EmptyList';
import Loading from '@component/Loading';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const buildOverlay = (Component, content) => {
  const OverlayComponent = () => (
    <Box className="flex min-h-[220px] items-center justify-center px-4 py-6">
      <Component content={content} />
    </Box>
  );

  return OverlayComponent;
};

const DataGridTable = ({
  rows,
  columns,
  getRowId,
  loading = false,
  loadingContent,
  emptyContent,
  minWidth = 0,
  hideFooter = false,
  sx,
  slots,
  ...restProps
}) => {
  const safeRows = Array.isArray(rows) ? rows : [];
  const estimatedColumnsWidth = Array.isArray(columns)
    ? columns.reduce((total, column) => {
        const baseWidth = Number(column?.width ?? column?.minWidth ?? 0);

        if (baseWidth > 0) {
          return total + baseWidth;
        }

        if (Number(column?.flex) > 0) {
          return total + 180;
        }

        return total + 140;
      }, 0)
    : 0;
  const resolvedMinWidth = Math.max(Number(minWidth) || 0, estimatedColumnsWidth);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full" style={resolvedMinWidth > 0 ? { minWidth: resolvedMinWidth } : undefined}>
        <DataGrid
          autoHeight
          rows={safeRows}
          columns={columns}
          getRowId={getRowId}
          loading={loading}
          hideFooter={hideFooter}
          disableRowSelectionOnClick
          disableColumnMenu
          disableColumnFilter
          disableColumnSorting
          getRowHeight={() => 'auto'}
          pageSizeOptions={[5, 10, 20, 50, 100]}
          slots={{
            loadingOverlay: buildOverlay(Loading, loadingContent),
            noRowsOverlay: buildOverlay(EmptyList, emptyContent),
            ...slots,
          }}
          sx={{
            width: '100%',
            minWidth: '100%',
            border: 'none',
            '& .MuiDataGrid-main': {
              minHeight: safeRows.length > 0 && !loading ? 'auto' : 280,
            },
            '& .MuiDataGrid-scrollbar--horizontal': {
              display: 'none',
            },
            '& .MuiDataGrid-cell': {
              alignItems: 'center',
              display: 'flex',
              lineHeight: 1.5,
              py: 1.5,
              whiteSpace: 'normal',
              wordBreak: 'break-word',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 700,
            },
            '& .MuiDataGrid-footerContainer': {
              borderTopColor: '#e2e8f0',
            },
            ...sx,
          }}
          {...restProps}
        />
      </div>
    </div>
  );
};

export default DataGridTable;
