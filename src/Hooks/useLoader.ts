import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../Store/Reducer/loaderSlice";

export const useLoader = () => {
  const dispatch = useDispatch();
  return {
    showLoader: () => dispatch(showLoader()),
    hideLoader: () => dispatch(hideLoader()),
  };
};
