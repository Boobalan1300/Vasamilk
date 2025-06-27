import {
  Table as AntTable,
  Button,
  Tooltip,
  type TablePaginationConfig,
} from "antd";
import { Images } from "../Utils/Images";

export interface ColumnType {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: any, record?: any, index?: number) => React.ReactNode;
}

interface TableProps {
  columns: ColumnType[];
  dataSource: any[];
  loading?: boolean;
  rowKey?: string | ((record: any) => string);
  onView?: (record: any) => void;
  onEdit?: (record: any) => void;
  pagination?: TablePaginationConfig;
  isUpdateAllowed?: boolean;
}

const Table = ({
  columns,
  dataSource,
  loading,
  rowKey = "id",
  onView,
  onEdit,
  pagination,
  isUpdateAllowed = false,
}: TableProps) => {
  const enhancedColumns = [
    ...columns,
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => {
        const canEdit = isUpdateAllowed && record.status_text === "Active";

        return (
          <div className="d-flex gap-2">
            <Tooltip title="View">
              <Button
                type="link"
                icon={<img src={Images.eye} alt="view" />}
                onClick={() => onView?.(record)}
              />
            </Tooltip>

            {canEdit && (
              <Tooltip title="Edit">
                <Button
                  type="link"
                  icon={<img src={Images.edit} alt="edit" />}
                  onClick={() => onEdit?.(record)}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="table-responsive">
      <AntTable
        columns={enhancedColumns}
        dataSource={dataSource}
        loading={loading}
        rowKey={rowKey}
        pagination={pagination}
        
      />
    </div>
  );
};

export default Table;
