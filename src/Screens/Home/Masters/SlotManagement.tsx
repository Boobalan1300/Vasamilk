import { useEffect, useState } from "react";
import { GetSlotList } from "../../../Service/ApiServices";
import { useToken } from "../../../Hooks/UserHook";
import { useLoader } from "../../../Hooks/useLoader";
import { toast } from "react-toastify";
import CustomTable from "../../../Components/CustomTable";
import { Card, Tooltip } from "antd";
import CustomPagination from "../../../Components/CustomPagination";
import CustomButton from "../../../Components/Button";
import { Images } from "../../../Utils/Images";
import type { Slot } from "../../../Utils/Types/Masters";
import SlotEditModal from "../../../Modal/SlotEditModal";

const SlotManagement = () => {
  const token = useToken();
  const { showLoader, hideLoader } = useLoader();

  const [slots, setSlots] = useState<Slot[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | undefined>();

  useEffect(() => {
    if (!token) return;
    fetchSlots(pagination.current, pagination.pageSize);
  }, [token, pagination.current, pagination.pageSize]);

  const fetchSlots = (page = 1, size = 10) => {
    if (!token) return;
    showLoader();

    const formData = new FormData();
    formData.append("token", token);

    GetSlotList(formData, page, size)
      .then((res) => {
        if (res.data.status === 1) {
          setSlots(res.data.data);
          setPagination((prev) => ({
            ...prev,
            total: res.data.total,
          }));
        } else {
          toast.error(res.data.msg || "Failed to fetch slots");
          setSlots([]);
          setPagination((prev) => ({
            ...prev,
            total: 0,
          }));
        }
      })
      .catch(() => {
        toast.error("Error in fetching slots");
        setSlots([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
        }));
      })
      .finally(() => {
        hideLoader();
      });
  };

  const handlePageChange = (page: number, size?: number) => {
    setPagination((prev) => ({
      current: page,
      pageSize: size ?? prev.pageSize,
      total: prev.total,
    }));
  };

  const handleEditSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setSlotModalVisible(true);
  };

  const handleSuccess = () =>
    fetchSlots(pagination.current, pagination.pageSize);

  const columns = [
    // { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Start Time", dataIndex: "start_time", key: "start_time" },
    { title: "End Time", dataIndex: "end_time", key: "end_time" },
    { title: "Booking End", dataIndex: "booking_end", key: "booking_end" },
    { title: "Created By", dataIndex: "created_by", key: "created_by" },
    { title: "Updated By", dataIndex: "updated_by", key: "updated_by" },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Slot) => (
        <div className="d-flex gap-2">
          <Tooltip title="Edit">
            <CustomButton
              className="p-0 border-0 bg-transparent"
              onClick={() => handleEditSlot(record)}
            >
              <img src={Images.edit} alt="edit" style={{ width: 20 }} />
            </CustomButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="container py-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Slots Management</h4>
      </div>

      <Card title="Slot List" className="shadow-sm mb-4">
        <CustomTable data={slots} columns={columns} />

        <div className="d-flex justify-content-end mt-3">
          <CustomPagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
          />
        </div>
      </Card>

      <SlotEditModal
        visible={slotModalVisible}
        onClose={() => setSlotModalVisible(false)}
        onSuccess={handleSuccess}
        slotData={selectedSlot}
      />
    </div>
  );
};

export default SlotManagement;
