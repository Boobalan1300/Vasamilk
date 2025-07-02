

import { Pagination } from "antd";

interface CustomPaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}

const CustomPagination = ({
  current,
  pageSize,
  total,
  onChange,
}: CustomPaginationProps) => {
  return (
    <Pagination
      current={current}
      pageSize={pageSize}
      total={total}
      showSizeChanger
      pageSizeOptions={["10", "20", "50", "100"]}
      onChange={onChange}

      // showQuickJumper

      // showTotal={(total, range) =>
      //   `Showing ${range[0]}–${range[1]} of ${total} entries`
      // }

    />
  );
};

export default CustomPagination;
