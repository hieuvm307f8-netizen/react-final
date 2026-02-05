import {useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { accessUser } from "@/store/slice/authSlice";
import type { AppDispatch } from "@/store/store";
import { useState } from "react";

const schema = z.object({
  email: z
    .string()
    .min(1, "Email must not be empty")
    .email("Email not in a correct form"),
  password: z
    .string()
    .min(1, "Password must not be empty")
    .min(3, "Password must have 3 characters or more"),
});

type LoginFormInputs = z.infer<typeof schema>;

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showResend, setShowResend] = useState(false);
  const [emailForResend, setEmailForResend] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const onsubmit = async (data: LoginFormInputs) => {
    setEmailForResend(data.email);
    const resultAction = await dispatch(accessUser({ data, type: "login" }));

    if (accessUser.rejected.match(resultAction)) {
      const errorMsg = resultAction.payload as string;
      if (
        errorMsg.includes("not been verified") ||
        errorMsg.includes("not verified")
      ) {
        setShowResend(true);
      }
    }

    if (accessUser.fulfilled.match(resultAction)) {
      navigate("/");
    } else {
      alert("login failed");
    }
  };

  const handleResend = () => {
    alert(`Resend verification to ${emailForResend}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex w-full max-w-[850px] justify-center items-center gap-8">
        
        <div className="hidden md:block w-[380px] h-[580px] relative">
          <img
            src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Instagram Mockup"
            className="w-full h-full object-cover rounded-xl shadow-md"
          />
        </div>

        <div className="flex flex-col gap-3 w-[350px]">
          
          <div className="flex flex-col bg-white border border-gray-300 p-8 pb-4">
            <div className="flex justify-center mb-8 mt-2">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png"
                alt="Instagram"
                className="w-[175px]"
              />
            </div>

            <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-1.5">
              <div className="flex flex-col gap-1">
                <input
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-[3px] px-2 py-3 outline-none focus:border-gray-400 placeholder:text-gray-500"
                  type="email"
                  placeholder="Phone number, username, or email"
                  {...register("email")}
                />
                {errors?.email?.message && (
                  <span className="text-red-500 text-[10px] pl-1">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <input
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-[3px] px-2 py-3 outline-none focus:border-gray-400 placeholder:text-gray-500"
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                />
                {errors?.password?.message && (
                  <span className="text-red-500 text-[10px] pl-1">
                    {errors.password.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-semibold rounded-[8px] py-1 h-auto"
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
            </form>

            <div className="flex items-center my-5 w-full">
              <div className="h-[1px] bg-gray-200 flex-1"></div>
              <span className="px-4 text-gray-500 text-[13px] font-semibold">OR</span>
              <div className="h-[1px] bg-gray-200 flex-1"></div>
            </div>

            <div className="flex flex-col items-center gap-4 mb-4">
              <button className="flex items-center gap-2 text-[#385185] font-semibold text-sm cursor-pointer hover:text-[#1877f2] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
                Log in with Facebook
              </button>

              {showResend ? (
                <button
                  onClick={handleResend}
                  type="button"
                  className="text-xs text-red-500 cursor-pointer hover:underline"
                >
                  Account not verified? Resend Email
                </button>
              ) : (
                <NavLink to={"/forgot-password"}>
                  <span className="text-xs text-[#00376b] cursor-pointer hover:text-blue-900">
                    Forgot password?
                  </span>
                </NavLink>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-5 flex justify-center items-center">
            <span className="text-sm text-gray-800">
              Don't have an account?{" "}
              <NavLink to={"/signup"} className="text-[#0095f6] font-semibold cursor-pointer">
                Sign up
              </NavLink>
            </span>
          </div>

          <div className="flex flex-col items-center gap-4 mt-1">
            <span className="text-sm text-gray-800">Get the app.</span>
            <div className="flex gap-2">
               <img src="https://static.cdninstagram.com/rsrc.php/v3/yt/r/Yfc020c87j0.png" alt="App Store" className="h-[40px] cursor-pointer"/>
               <img src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png" alt="Google Play" className="h-[40px] cursor-pointer"/>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}