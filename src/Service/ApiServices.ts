import axios from "./Axios";

export const handleLogin = (formData: any) => {
  return axios.post("/milk-api/auth/login", formData);
};

export const handleForgetPasswordService = (formData: any) => {
  return axios.post("/milk-api/auth/forgot-password", formData);
};

export const handleVerifyOtp = (formData: any) => {
  return axios.post("/milk-api/auth/otp-verification", formData);
};

export const handleResendOtp = (formData: any) => {
  return axios.post("/milk-api/auth/resend-otp", formData);
};

export const handleResetPassword = (formData: any) => {
  return axios.post("/milk-api/auth/reset-password", formData);
};

export const handleLogout = (formData: any) => {
  return axios.post("/milk-api/auth/logout", formData);
};



// user

export const fetchUserList = (page: number, size: number, formData: FormData) => {
  return axios.post(`/milk-api/user/list-users?page=${page}&size=${size}`, formData);
};


export const handleCreateUser = (formData: any) => {
  return axios.post("/milk-api/user/create-user", formData);
};

export const changeUserStatus = (formData: FormData) => {
  return axios.post("/milk-api/user/change-status-user", formData);
};

export const viewUser = (formData: FormData) => {
  return axios.post("/milk-api/user/view-user", formData);
};



export const fetchLinesDropDown = (formData: FormData) => {
  return axios.post("/milk-api/drop-down/lines-drop-down", formData);
};

export const fetchPriceTagDropDown = (formData: FormData) => {
  return axios.post("/milk-api/drop-down/price-tag-drop-down", formData);
};

export const fetchUserById = (payload: any) => {
  return axios.post("/milk-api/user/view-user", payload);
};

export const handleEditUser = (payload: any) => {
  return axios.post("/milk-api/user/edit-user", payload);
};

// Inventory

export const GetDailyInventoryReport = (fromData: any) => {
  return axios.post("/milk-api/dashboard/daily-inventory-report", fromData);
};

export const GetInventoryList = (formData: FormData, page = 1, size = 10) => {
  return axios.post(`/milk-api/inventorylist-inventory?page=${page}&size=${size}`,formData);
};


export const GetInventoryLog = (formData: FormData, page = 1, size = 10) => {
  return axios.post(
    `/milk-api/inventory/list-inventory-log?page=${page}&size=${size}`,
    formData
  );
};


export const AddInventory = (formData: FormData) => {
  return axios.post("/milk-api/inventory/add-inventory", formData);
};

export const UpdateInventory = (formData: FormData) => {
  console.log("called");
  return axios.post("/milk-api/inventory/update-inventory", formData);
};

export const AddInventoryComment = (formData: FormData) => {
  return axios.post("/milk-api/inventory/inventory-comment", formData);
};

export const GetMilkDailyReport = (formData: FormData) => {
  return axios.post("/milk-api/dashboard/daily-milk-required-report", formData);
};

export const GetVendorMilkReport = (formData: FormData) => {
  return axios.post("/milk-api/dashboard/vendor-milk-report", formData);
};


export const GetDistributorLines =(formData:FormData)=>{
    return axios.post("/milk-api/slot-assign/get-distributer-line", formData);
}


//not used
export const GetDistributorInventoryLog = ( page=1, size=50,formData: FormData) => {
  return axios.post(
    `/milk-api/milk-sales/list-distributor-log?page=${page}&size=${size}`,
    formData
  );
};




export const GetSlotMapping = (formData: FormData, page = 1, size = 10) => {
  return axios.post(
    `/milk-api/milk-sales/list-slot-mapping?page=${page}&size=${size}`,
    formData
  );
};




export const AddDistributorInventoryLog = (formData: FormData) => {
  return axios.post("/milk-api/milk-sales/distributer-inventory-log", formData);
};




export const GetDistributorWithLines = (formData: FormData) => {
  return axios.post(`/milk-api/slot-assign/get-distributer-line`, formData);
};



export const AssignDistributorSlotMap = (payload:object) => {
  return axios.post(`/milk-api/slot-assign/assign-slot-map`, payload);
};


export const GetCustomers = (formData: FormData) => {
  return axios.post(`/milk-api/drop-down/customer-drop-down`, formData);
};


export const ListAssignedSlot = ( page=1, size=10, payload:any) => {
  return axios.post(
    `/milk-api/slot-assign/list-assigned-slot?page=${page}&size=${size}`,
    payload
  );
};



// ---------   Distributor  Dashboard  ------------


export const GetReportByDate =(formData:FormData)=>{
  return axios.post(`/milk-api/dashboard/daily-inventory-report-by-date`,formData)
}

// fetchLinesDropDown  - /milk-api/drop-down/lines-drop-down

// GetSlotMapping  - /milk-api/milk-sales/list-slot-mapping



// ---------   Masters   ------------

export const GetSlotList=(formData:FormData,page=1,size=10)=>{
  return axios.post(`/milk-api/masters/list-slot?page=${page}&size=${size}`,formData)
}
  
export const UpdateSlot=(formData:FormData)=>{
  return axios.post(`/milk-api/masters/update-slot`,formData)
}



//lines

export const GetLinesList=(formData:FormData,page=1,size=10)=>{
  return axios.post(`/milk-api/masters/list-lines?page=${page}&size=${size}`,formData)
}


export const CreateLine = (formData: FormData) => {
  return axios.post("/milk-api/masters/create-lines", formData);
};

export const UpdateLine = (formData: FormData) => {
  return axios.post("/milk-api/masters/update-lines", formData);
};

export const DeleteLine = (formData: FormData) => {
  return axios.post("/milk-api/masters/delete-lines", formData);
};

export const ToggleLineStatus = (formData: FormData) => {
  return axios.post("/milk-api/masters/inactive-lines", formData);
};


// PRice



export const GetPriceTagsList = (formData: FormData, page = 1, size = 10) => {
  return axios.post(`/milk-api/masters/list-price-tag?page=${page}&size=${size}`, formData);
};

export const CreatePriceTag = (formData: FormData) => {
  return axios.post(`/milk-api/masters/create-price-tag`, formData);
};

export const UpdatePriceTag = (formData: FormData) => {
  return axios.post(`/milk-api/masters/update-price-tag`, formData);
};

export const DeletePriceTag = (formData: FormData) => {
  return axios.post(`/milk-api/masters/delete-price-tag`, formData);
};

export const TogglePriceTagStatus = (data: FormData) => {
  return axios.post("/milk-api/masters/inactive-price-tag", data);
};


// Reason

export const GetReasonList = (formData: FormData, page = 1, size = 10) => {
  return axios.post(`/milk-api/masters/list-reason?page=${page}&size=${size}`, formData);
};

export const CreateReason = (formData: FormData) => {
  return axios.post(`/milk-api/masters/create-reason`, formData);
};

export const UpdateReason = (formData: FormData) => {
  return axios.post(`/milk-api/masters/update-reason`, formData);
};

export const DeleteReason = (formData: FormData) => {
  return axios.post(`/milk-api/masters/delete-reason`, formData);
};

export const ToggleReasonStatus = (formData: FormData) => {
  return axios.post("/milk-api/masters/inactive-reason", formData);
};

