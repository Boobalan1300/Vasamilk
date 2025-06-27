
import type { TablePaginationConfig } from "antd";

interface CustomPaginationProps {
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onChange: (page: number, pageSize: number) => void;
}

export const customPagination = ({
  pagination,
  onChange,
}: CustomPaginationProps): TablePaginationConfig => ({
  current: pagination.current,
  pageSize: pagination.pageSize,
  total: pagination.total,
  showSizeChanger: true,
  pageSizeOptions: ["10", "20", "50", "100"],
  showTotal: (total, range) =>
    `Showing ${range[0]}–${range[1]} of ${total} entries`,
  onChange,
});
