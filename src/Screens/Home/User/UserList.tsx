
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useToken } from "../../../Hooks/UserHook";
import { useLoader } from "../../../Hooks/useLoader";
import {
  fetchUserList,
  changeUserStatus,
  viewUser,
} from "../../../Service/ApiServices";
import ViewUser from "./ViewUser";
import CustomDropDown from "../../../Components/CustomDropDown";
import CustomTable from "../../../Components/CustomTable";
import CustomPagination from "../../../Components/CustomPagination";
import { Images } from "../../../Utils/Images";
import { Tag, Switch, message, Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";

import CustomButton from "../../../Components/Button";

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
    const navigate = useNavigate();
  const token = useToken();
  const { showLoader, hideLoader } = useLoader();
  const [data, setData] = useState<ApiUser[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);
  const [viewUserDetails, setViewUserDetails] = useState<any>(null);



  const formik = useFormik<FilterValues>({
    initialValues: {
      pay_type: "",
      customer_type: "",
      user_type: "",
      line_id: "",
      price_tag_id: "",
      status: "",
    },
    onSubmit: (values) => {
      setSubmittedFilters(values);
      setPagination({ current: 1, pageSize: 10 });
    },
  });

  const [submittedFilters, setSubmittedFilters] = useState<FilterValues>({});
  

  useEffect(() => {
    if (token) fetchUsers();
  }, [token, pagination.current, pagination.pageSize, submittedFilters]);

  const fetchUsers = () => {
    if (!token) return;
    showLoader();

    const form = new FormData();
    form.append("token", token);

    Object.entries(submittedFilters).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    fetchUserList(pagination.current, pagination.pageSize, form)
      .then((res) => {
        setData(res.data?.data || []);
        setTotal(res.data?.total || 0);
      })
      .catch(() => {
        message.error("Failed to fetch users");
      })
      .finally(() => {
        hideLoader();
      });
  };

  const resetFilters = () => {
    formik.resetForm();
    setSubmittedFilters({});
    setPagination({ current: 1, pageSize: 10 });
  };

  const updateStatus = (
    userId: number,
    newStatus: number,
    successMsg: string
  ) => {
    if (!token) return;
    const form = new FormData();
    form.append("token", token);
    form.append("user_id", userId.toString());
    form.append("status", newStatus.toString());

    changeUserStatus(form)
      .then(() => {
        message.success(successMsg);
        fetchUsers();
      })
      .catch(() => {
        message.error("Status update failed");
      });
  };

  const handleViewToggle = (userId: number) => {
    if (viewingUserId === userId) {
      setViewingUserId(null);
      setViewUserDetails(null);
    } else {
      if (!token) return;
      const formData = new FormData();
      formData.append("token", token);
      formData.append("user_id", userId.toString());

      viewUser(formData)
        .then((res) => {
          if (res.data.status === 1) {
            setViewingUserId(userId);
            setViewUserDetails(res.data.data);
          } else {
            message.error(res.data.msg || "Failed to fetch user details");
          }
        })
        .catch(() => {
          message.error("Failed to fetch user details");
        });
    }
  };

  const columns: ColumnsType<ApiUser> = [
    {
      title: "S. No.",
      key: "serial",
      render: (_text, _record, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
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
                   <div className="d-flex justify-content-center">
           <p>-</p>
         </div>
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
         <div className="d-flex justify-content-center">
           <p>-</p>
         </div>
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
        <div className="d-flex gap-2">
          <Tooltip title={viewingUserId === record.id ? "Hide" : "View"}>
            <CustomButton
              className="p-0 border-0 bg-transparent"
              onClick={() => handleViewToggle(record.id)}
            >
              <img src={Images.eye} alt="view" style={{ width: 20 }} />
            </CustomButton>
          </Tooltip>

          <Tooltip title="Edit">
            <CustomButton
              className="p-0 border-0 bg-transparent"
              onClick={() =>
                navigate("/editUser", { state: { id: record.id } })
              }
            >
              <img src={Images.edit} alt="edit" style={{ width: 20 }} />
            </CustomButton>
          </Tooltip>

          <Popconfirm
            title="Delete this user?"
            onConfirm={() => updateStatus(record.id, -1, "User deleted")}
          >
            <Tooltip title="Delete">
              <CustomButton className="p-0 border-0 bg-transparent text-danger">
                <img src={Images.trash} alt="delete" style={{ width: 20 }} />
              </CustomButton>
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="container my-3">
       <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">User List</h2>
       <CustomButton
            className="btn-grey px-3 py-1"
          onClick={() => navigate("/createUser")}
        >
          Add User
        </CustomButton>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <CustomDropDown
          dropdownKeys={[
            "user_type",
            "customer_type",
            "pay_type",
            "line_id",
            "price_tag_id",
            "status",
          ]}
          formik={formik}
        />

        <div className="d-flex gap-2 mb-5">
          <CustomButton type="submit" className="btn-grey px-3 py-1">
            Apply Filters
          </CustomButton>
          <CustomButton onClick={resetFilters} className="btn-grey px-3 py-1">
            Reset Filters
          </CustomButton>
        </div>
      </form>

      <CustomTable
        columns={columns}
        data={data}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) =>
            viewingUserId === record.id && viewUserDetails ? (
              <ViewUser data={viewUserDetails} />
            ) : null,
          rowExpandable: () => true,
          expandedRowKeys: viewingUserId ? [viewingUserId] : [],
          onExpand: (_, record) => handleViewToggle(record.id),
          expandIcon: () => null,
        }}
      />

      <div className="d-flex justify-content-end my-3">
        <CustomPagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={total}
          onChange={(page, pageSize) =>
            setPagination({ current: page, pageSize })
          }
        />
      </div>
    </div>
  );
};

export default UserList;





// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useFormik } from "formik";
// import { useToken } from "../../../Hooks/UserHook";
// import { useLoader } from "../../../Hooks/useLoader";
// import {
//   fetchUserList,
//   changeUserStatus,
//   viewUser,
// } from "../../../Service/ApiServices";
// import ViewUser from "./ViewUser";
// import CustomDropDown from "../../../Components/CustomDropDown";
// import CustomTable from "../../../Components/CustomTable";
// import CustomPagination from "../../../Components/CustomPagination";
// import { Images } from "../../../Utils/Images";
// import { Tag, Switch, message, Popconfirm, Tooltip } from "antd";
// import type { ColumnsType } from "antd/es/table";

// import CustomButton from "../../../Components/Button";

// interface ApiUser {
//   id: number;
//   username: string;
//   name: string;
//   phone: string;
//   email: string | null;
//   user_type: string | null;
//   customer_type: string | null;
//   line_name: string | null;
//   pay_type: number;
//   price_tag_name: string | null;
//   status: number;
// }

// interface FilterValues {
//   pay_type?: string;
//   customer_type?: string;
//   user_type?: string;
//   line_id?: string;
//   price_tag_id?: string;
//   status?: string;
// }

// const UserList = () => {
//     const navigate = useNavigate();
//   const token = useToken();
//   const { showLoader, hideLoader } = useLoader();
//   const [data, setData] = useState<ApiUser[]>([]);
//   const [total, setTotal] = useState(0);
//   const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
//   const [viewingUserId, setViewingUserId] = useState<number | null>(null);
//   const [viewUserDetails, setViewUserDetails] = useState<any>(null);



//   const formik = useFormik<FilterValues>({
//     initialValues: {
//       pay_type: "",
//       customer_type: "",
//       user_type: "",
//       line_id: "",
//       price_tag_id: "",
//       status: "",
//     },
//     onSubmit: (values) => {
//       setSubmittedFilters(values);
//       setPagination({ current: 1, pageSize: 10 });
//     },
//   });

//   const [submittedFilters, setSubmittedFilters] = useState<FilterValues>({});

//   useEffect(() => {
//     if (token) fetchUsers();
//   }, [token, pagination.current, pagination.pageSize, submittedFilters]);

//   const fetchUsers = () => {
//     if (!token) return;
//     showLoader();

//     const form = new FormData();
//     form.append("token", token);

//     Object.entries(submittedFilters).forEach(([key, value]) => {
//       if (value) form.append(key, value);
//     });

//     fetchUserList(pagination.current, pagination.pageSize, form)
//       .then((res) => {
//         setData(res.data?.data || []);
//         setTotal(res.data?.total || 0);
//       })
//       .catch(() => {
//         message.error("Failed to fetch users");
//       })
//       .finally(() => {
//         hideLoader();
//       });
//   };

//   const resetFilters = () => {
//     formik.resetForm();
//     setSubmittedFilters({});
//     setPagination({ current: 1, pageSize: 10 });
//   };

//   const updateStatus = (
//     userId: number,
//     newStatus: number,
//     successMsg: string
//   ) => {
//     if (!token) return;
//     const form = new FormData();
//     form.append("token", token);
//     form.append("user_id", userId.toString());
//     form.append("status", newStatus.toString());

//     changeUserStatus(form)
//       .then(() => {
//         message.success(successMsg);
//         fetchUsers();
//       })
//       .catch(() => {
//         message.error("Status update failed");
//       });
//   };

//   const handleViewToggle = (userId: number) => {
//     if (viewingUserId === userId) {
//       setViewingUserId(null);
//       setViewUserDetails(null);
//     } else {
//       if (!token) return;
//       const formData = new FormData();
//       formData.append("token", token);
//       formData.append("user_id", userId.toString());

//       viewUser(formData)
//         .then((res) => {
//           if (res.data.status === 1) {
//             setViewingUserId(userId);
//             setViewUserDetails(res.data.data);
//           } else {
//             message.error(res.data.msg || "Failed to fetch user details");
//           }
//         })
//         .catch(() => {
//           message.error("Failed to fetch user details");
//         });
//     }
//   };

//   const columns: ColumnsType<ApiUser> = [
//     {
//       title: "S. No.",
//       key: "serial",
//       render: (_text, _record, index) =>
//         (pagination.current - 1) * pagination.pageSize + index + 1,
//     },
//     { title: "Username", dataIndex: "username", key: "username" },
//     { title: "Name", dataIndex: "name", key: "name" },
//     { title: "Phone", dataIndex: "phone", key: "phone" },
//     {
//       title: "User Type",
//       dataIndex: "user_type",
//       key: "user_type",
//       render: (t) => <Tag>{t || "-"}</Tag>,
//     },
//     {
//       title: "Customer Type",
//       dataIndex: "customer_type",
//       key: "customer_type",
//       render: (t) =>
//         t === "regular" ? (
//           <Tag color="blue">Regular</Tag>
//         ) : t === "occasional" ? (
//           <Tag color="green">Occasional</Tag>
//         ) : (
//                    <div className="d-flex justify-content-center">
//            <p>-</p>
//          </div>
//         ),
//     },
//     {
//       title: "Pay Type",
//       dataIndex: "pay_type",
//       key: "pay_type",
//       render: (p) =>
//         p === 1 ? (
//           <Tag color="orange">Daily</Tag>
//         ) : p === 2 ? (
//           <Tag color="purple">Monthly</Tag>
//         ) : (
//          <div className="d-flex justify-content-center">
//            <p>-</p>
//          </div>
//         ),
//     },
//     { title: "Line Name", dataIndex: "line_name", key: "line_name" },
//     { title: "Price Tag", dataIndex: "price_tag_name", key: "price_tag_name" },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status, record) => (
//         <Popconfirm
//           title={`Are you sure to ${status === 1 ? "deactivate" : "activate"}?`}
//           onConfirm={() =>
//             updateStatus(
//               record.id,
//               status === 1 ? 0 : 1,
//               status === 1 ? "User deactivated" : "User activated"
//             )
//           }
//         >
//           <Switch checked={status === 1} />
//         </Popconfirm>
//       ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <div className="d-flex gap-2">
//           <Tooltip title={viewingUserId === record.id ? "Hide" : "View"}>
//             <CustomButton
//               className="p-0 border-0 bg-transparent"
//               onClick={() => handleViewToggle(record.id)}
//             >
//               <img src={Images.eye} alt="view" style={{ width: 20 }} />
//             </CustomButton>
//           </Tooltip>

//           <Tooltip title="Edit">
//             <CustomButton
//               className="p-0 border-0 bg-transparent"
//               onClick={() => navigate("/editUser", { state: { userData: record } })}
//             >
//               <img src={Images.edit} alt="edit" style={{ width: 20 }} />
//             </CustomButton>
//           </Tooltip>

//           <Popconfirm
//             title="Delete this user?"
//             onConfirm={() => updateStatus(record.id, -1, "User deleted")}
//           >
//             <Tooltip title="Delete">
//               <CustomButton className="p-0 border-0 bg-transparent text-danger">
//                 <img src={Images.trash} alt="delete" style={{ width: 20 }} />
//               </CustomButton>
//             </Tooltip>
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="container my-3">
//        <div className="d-flex justify-content-between align-items-center mb-3">
//         <h2 className="mb-0">User List</h2>
//        <CustomButton
//             className="btn-grey px-3 py-1"
//           onClick={() => navigate("/createUser")}
//         >
//           Add User
//         </CustomButton>
//       </div>

//       <form onSubmit={formik.handleSubmit}>
//         <CustomDropDown
//           dropdownKeys={[
//             "user_type",
//             "customer_type",
//             "pay_type",
//             "line_id",
//             "price_tag_id",
//             "status",
//           ]}
//           formik={formik}
//         />

//         <div className="d-flex gap-2 mb-5">
//           <CustomButton type="submit" className="btn-grey px-3 py-1">
//             Apply Filters
//           </CustomButton>
//           <CustomButton onClick={resetFilters} className="btn-grey px-3 py-1">
//             Reset Filters
//           </CustomButton>
//         </div>
//       </form>

//       <CustomTable
//         columns={columns}
//         data={data}
//         rowKey="id"
//         expandable={{
//           expandedRowRender: (record) =>
//             viewingUserId === record.id && viewUserDetails ? (
//               <ViewUser data={viewUserDetails} />
//             ) : null,
//           rowExpandable: () => true,
//           expandedRowKeys: viewingUserId ? [viewingUserId] : [],
//           onExpand: (_, record) => handleViewToggle(record.id),
//           expandIcon: () => null,
//         }}
//       />

//       <div className="d-flex justify-content-end my-3">
//         <CustomPagination
//           current={pagination.current}
//           pageSize={pagination.pageSize}
//           total={total}
//           onChange={(page, pageSize) =>
//             setPagination({ current: page, pageSize })
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default UserList;
