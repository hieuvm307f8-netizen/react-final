import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { accessUser } from "@/store/slice/authSlice";
import type { AppDispatch } from "@/store/store";

// --- Logic Schema Giữ Nguyên ---
const schema = z.object({
  fullName: z.string().min(2, "Name has to be 2 characters"),
  username: z.string().min(3, "Username must be 3 characters or more"),
  email: z.string().min(1, "email must not be empty").email("Email is not correct"),
  password: z.string().min(8, "password must be 8 characters or more").regex(/[A-Z]/, "Need 1 or more uppercase"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "password not match",
  path: ["confirmPassword"]
});

type RegisterFormInputs = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting }, // Thêm isSubmitting để disable nút khi đang gửi
  } = useForm<RegisterFormInputs>({
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  // --- Logic Submit Giữ Nguyên ---
  const onsubmit = async (data: RegisterFormInputs) => {
    const payload = {
      email: data.email,
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
      fullName: data.fullName,
    };
    const registerData = await dispatch(
      accessUser({ data: payload, type: "register" })
    );

    if (accessUser.fulfilled.match(registerData)) {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col gap-3 w-[350px]">
        
        <div className="bg-white border border-gray-300 px-10 py-8 flex flex-col items-center">
          <div className="flex justify-center mb-4 mt-2">
             <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/800px-Instagram_logo.svg.png"
                alt="Instagram"
                className="w-[175px]"
              />
          </div>

          <h2 className="text-[#737373] font-semibold text-[17px] text-center mb-5 leading-5">
            Sign up to see photos and videos from your friends.
          </h2>

          <button type="button" className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-semibold rounded-[8px] py-1.5 flex items-center justify-center gap-2 mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
             </svg>
             Log in with Facebook
          </button>

          <div className="flex items-center w-full mb-4">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="px-4 text-gray-500 text-[13px] font-bold">OR</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit(onsubmit)} className="flex flex-col gap-1.5 w-full">
            <div className="flex flex-col">
              <input
                {...register("email")}
                placeholder="Mobile Number or Email"
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-[3px] px-2 py-2.5 outline-none focus:border-gray-400 placeholder:text-gray-500"
              />
              
              {errors.email && <span className="text-red-500 text-[10px] mt-1 flex items-center gap-1">✕ {errors.email.message}</span>}
            </div>

            <div className="flex flex-col">
              <input
                {...register("fullName")}
                placeholder="Full Name"
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-[3px] px-2 py-2.5 outline-none focus:border-gray-400 placeholder:text-gray-500"
              />
              {errors.fullName && <span className="text-red-500 text-[10px] mt-1 flex items-center gap-1">✕ {errors.fullName.message}</span>}
            </div>

            <div className="flex flex-col">
              <input
                {...register("username")}
                placeholder="Username"
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-[3px] px-2 py-2.5 outline-none focus:border-gray-400 placeholder:text-gray-500"
              />
              {errors.username && <span className="text-red-500 text-[10px] mt-1 flex items-center gap-1">✕ {errors.username.message}</span>}
            </div>

            <div className="flex flex-col">
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-[3px] px-2 py-2.5 outline-none focus:border-gray-400 placeholder:text-gray-500"
              />
              {errors.password && <span className="text-red-500 text-[10px] mt-1 flex items-center gap-1">✕ {errors.password.message}</span>}
            </div>

            <div className="flex flex-col">
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm Password"
                className="w-full text-xs bg-gray-50 border border-gray-200 rounded-[3px] px-2 py-2.5 outline-none focus:border-gray-400 placeholder:text-gray-500"
              />
              {errors.confirmPassword && <span className="text-red-500 text-[10px] mt-1 flex items-center gap-1">✕ {errors.confirmPassword.message}</span>}
            </div>

            <div className="text-center mt-2 mb-2">
                <p className="text-[12px] text-gray-500 leading-4">
                  People who use our service may have uploaded your contact information to Instagram. <span className="text-[#00376b] font-semibold">Learn More</span>
                </p>
                <p className="text-[12px] text-gray-500 leading-4 mt-3">
                  By signing up, you agree to our <span className="text-[#00376b] font-semibold">Terms</span> , <span className="text-[#00376b] font-semibold">Privacy Policy</span> and <span className="text-[#00376b] font-semibold">Cookies Policy</span> .
                </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full bg-[#0095f6] hover:bg-[#1877f2] text-white text-sm font-semibold rounded-[8px] py-1 h-auto"
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
          </form>
        </div>

        <div className="bg-white border border-gray-300 p-5 flex justify-center items-center">
          <span className="text-sm text-gray-800">
            Have an account?{" "}
            <NavLink to="/login" className="text-[#0095f6] font-semibold cursor-pointer">
              Log in
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
  );
}