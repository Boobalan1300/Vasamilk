
import { useEffect, useState } from "react";
import { getUser } from "../../../Utils/Cookie";
import {
  fetchUserList,
  changeUserStatus,
  viewUser,
} from "../../../Service/ApiServices";
import {
  Table,
  Pagination,
  Button,
  Tag,
  Switch,
  message,
  Popconfirm,
  Spin,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "react-router-dom";
import UserFilter from "./UserFilter";
import ViewUser from "./ViewUser";

interface ApiUser {
  id: number;
  username: string;
  name: string;
  phone: string;
  email: string | null;
  user_type: string | null;
  customer_type: string | null;
  line_name: string | null;
  pay_type: number;
  price_tag_name: string | null;
  status: number;
}

interface FilterValues {
  pay_type?: string;
  customer_type?: string;
  user_type?: string;
  line_id?: string;
  price_tag_id?: string;
  status?: string;
}

const UserList = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ApiUser[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterValues>({});
  const [submittedFilters, setSubmittedFilters] = useState<FilterValues>({});
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);
  const [viewUserDetails, setViewUserDetails] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const u = getUser();
    if (u?.token) setToken(u.token);
    else setError("Invalid user");
  }, []);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, pagination.current, pagination.pageSize, submittedFilters]);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);

    const form = new FormData();
    form.append("token", token);

    Object.entries(submittedFilters).forEach(([key, value]) => {
      if (value) {
        form.append(key, value);
      }
    });

    try {
      const res = await fetchUserList(
        pagination.current,
        pagination.pageSize,
        form
      );
      setData(res.data?.data || []);
      setTotal(res.data?.total || 0);
    } catch {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    field: keyof FilterValues,
    value: string | null
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value || undefined }));
  };

  const applyFilters = () => {
    setSubmittedFilters(filters);
    setPagination({ current: 1, pageSize: 10 });
  };

  const resetFilters = () => {
    setFilters({});
    setSubmittedFilters({});
    setPagination({ current: 1, pageSize: 10 });
  };

  const updateStatus = async (
    userId: number,
    newStatus: number,
    successMsg: string
  ) => {
    try {
      const form = new FormData();
      form.append("token", token);
      form.append("user_id", userId.toString());
      form.append("status", newStatus.toString());

      await changeUserStatus(form);
      message.success(successMsg);
      fetchUsers();
    } catch {
      message.error("Status update failed");
    }
  };

  const handleViewToggle = async (userId: number) => {
    if (viewingUserId === userId) {
      setViewingUserId(null);
      setViewUserDetails(null);
    } else {
      try {
        const formData = new FormData();
        formData.append("token", token);
        formData.append("user_id", userId.toString());
        const res = await viewUser(formData);
        if (res.data.status === 1) {
          setViewingUserId(userId);
          setViewUserDetails(res.data.data);
        } else {
          message.error(res.data.msg || "Failed to fetch user details");
        }
      } catch {
        message.error("Failed to fetch user details");
      } finally {
      }
    }
  };

  const columns: ColumnsType<ApiUser> = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (e) => e || "N/A",
    },
    {
      title: "User Type",
      dataIndex: "user_type",
      key: "user_type",
      render: (t) => <Tag>{t || "-"}</Tag>,
    },
    {
      title: "Customer Type",
      dataIndex: "customer_type",
      key: "customer_type",
      render: (t) =>
        t === "regular" ? (
          <Tag color="blue">Regular</Tag>
        ) : t === "occasional" ? (
          <Tag color="green">Occasional</Tag>
        ) : (
          <Tag>-</Tag>
        ),
    },
    {
      title: "Pay Type",
      dataIndex: "pay_type",
      key: "pay_type",
      render: (p) =>
        p === 1 ? (
          <Tag color="orange">Daily</Tag>
        ) : p === 2 ? (
          <Tag color="purple">Monthly</Tag>
        ) : (
          <Tag>-</Tag>
        ),
    },
    { title: "Line Name", dataIndex: "line_name", key: "line_name" },
    { title: "Price Tag", dataIndex: "price_tag_name", key: "price_tag_name" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Popconfirm
          title={`Are you sure to ${status === 1 ? "deactivate" : "activate"}?`}
          onConfirm={() =>
            updateStatus(
              record.id,
              status === 1 ? 0 : 1,
              status === 1 ? "User deactivated" : "User activated"
            )
          }
        >
          <Switch checked={status === 1} />
        </Popconfirm>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => navigate('/editUser',{state:{id:record.id}})}>
            Edit
          </Button>
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => updateStatus(record.id, -1, "User deleted")}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
          <Button type="link" onClick={() => handleViewToggle(record.id)}>
            {viewingUserId === record.id ? "Hide" : "View"}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>User List</h2>
        <Button className="btn-grey" onClick={() => navigate("/createUser")}>
          Add New User
        </Button>
      </div>

      <UserFilter
        filters={filters}
        loading={loading}
        onFilterChange={handleFilterChange}
        onExportFilters={applyFilters}
        onResetFilters={resetFilters}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-5">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            expandable={{
              expandedRowRender: (record) =>
                viewingUserId === record.id && viewUserDetails ? (
                  <ViewUser data={viewUserDetails} />
                ) : null,
              rowExpandable: () => true,
              expandedRowKeys: viewingUserId ? [viewingUserId] : [],
              onExpand: (_, record) => handleViewToggle(record.id),
            }}
          />
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={total}
              showSizeChanger
              onChange={(page, pageSize) =>
                setPagination({ current: page, pageSize })
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;
