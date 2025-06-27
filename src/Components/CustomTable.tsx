
import { Table, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { customPagination } from "./CustomPagination";

export interface ActionConfig<T> {
  showView?: (record: T) => boolean;
  showEdit?: (record: T) => boolean;
  showUpdate?: (record: T) => boolean;
  showAdd?: (record: T) => boolean;
  onView?: (record: T) => void;
  onEdit?: (record: T) => void;
  onUpdate?: (record: T) => void;
  onAdd?: (record: T) => void;
}

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnsType<T>;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number, pageSize: number) => void;
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  actions?: ActionConfig<T>;
}

export const CustomTable = <T extends object>({
  data,
  columns,
  pagination,
  onPageChange,
  loading = false,
  rowKey = "id",
  actions,
}: CustomTableProps<T>) => {
  const actionColumn = actions
    ? {
        title: "Actions",
        key: "actions",
        render: (_: any, record: T) => (
          <Space>
            {actions.showView?.(record) && (
              <Button size="small" onClick={() => actions.onView?.(record)}>
                View
              </Button>
            )}
            {actions.showEdit?.(record) && (
              <Button size="small" onClick={() => actions.onEdit?.(record)}>
                Edit
              </Button>
            )}
            {actions.showUpdate?.(record) && (
              <Button size="small" onClick={() => actions.onUpdate?.(record)}>
                Update
              </Button>
            )}
            {actions.showAdd?.(record) && (
              <Button size="small" onClick={() => actions.onAdd?.(record)}>
                Add
              </Button>
            )}
          </Space>
        ),
      }
    : null;

  const finalColumns = actionColumn ? [...columns, actionColumn] : columns;

  return (
    <Table
      dataSource={data}
      columns={finalColumns}
      pagination={customPagination({ pagination, onChange: onPageChange })}
      loading={loading}
      rowKey={rowKey}
        
    />
  );
};
