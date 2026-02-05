import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import authService from "@/services/authService";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onsubmit = async (data: any) => {
    if (!token) return;
    try {
      await authService.resetPassword(token, data.password);
      alert("change password successs");
      navigate("/login");
    } catch (error: any) {
      alert("error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Reset password</h1>
      <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-3 w-[300px]">
        <input
          {...register("password", { required: true, minLength: 6 })}
          type="password"
          className="border p-2 rounded"
          placeholder="new password..."
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Confirm</button>
      </form>
    </div>
  );
}