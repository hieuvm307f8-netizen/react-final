import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import authService from "@/services/authService";
import { NavLink } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Email not correct"),
});

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  
  const onsubmit = async (data: any) => {
    try {
      await authService.forgotPassword(data.email);
      setMessage("sucess");
    } catch (error: any) {
      setMessage(error.message || "can't find email");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">forgot pasword?</h1>
      <p className="text-gray-500">enter email</p>

      {message && <div className="bg-green-100 p-3 rounded text-green-700">{message}</div>}

      <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-3 w-[300px]">
        <input
          {...register("email")}
          className="border p-2 rounded"
          placeholder="email..."
        />
        {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}

        <button type="submit" className="bg-blue-500 text-white p-2 rounded font-bold">send link</button>
      </form>
      <NavLink to="/login" className="text-sm font-bold text-blue-900">back to login page</NavLink>
    </div>
  );
}