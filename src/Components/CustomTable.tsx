
import { Table } from "antd";
import type { ColumnsType,TableProps  } from "antd/es/table";

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnsType<T>;
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
    expandable?: TableProps<T>["expandable"]; 
}

const CustomTable = <T extends object>({
  data,
  columns,
  loading = false,
  rowKey = "id",
  expandable,
}: CustomTableProps<T>) => {
  return (
    <div className="table-responsive">
      <Table
        dataSource={data}
        columns={columns}
        loading={loading}
        rowKey={rowKey}
        
        pagination={false}
        expandable={expandable} 
      />
    </div>
  );
};

export default CustomTable;
