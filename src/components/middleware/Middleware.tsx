import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "@/store/slice/authSlice";
import { type AppDispatch, type RootState } from "@/store/store";
import { Spinner } from "../ui/spinner";

export default function Middleware() {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, accessToken, loading } = useSelector((state: RootState) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const Auth = async () => {
      if (accessToken && !currentUser) {
        try {
          await dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          console.error("error:", error);
        }
      }
      setIsChecking(false);
    };

    Auth();
  }, [accessToken, currentUser, dispatch]);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  if (isChecking || (accessToken && !currentUser)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return <Outlet />;
}