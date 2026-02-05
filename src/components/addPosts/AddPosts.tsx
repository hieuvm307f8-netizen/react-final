import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { createNewPost } from "@/store/slice/postsSlice";
import Avatar from "../shared/Avatar";
import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react"; 

type Props = {
  onClose: () => void;
};
type FormDataSchema = {
  addPosts?: string;
};

const schema = z.object({
  addPosts: z.string().optional(),
});

export default function AddPosts({ onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.auth.currentUser);
  const { loading } = useSelector((state: RootState) => state.posts);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<FormDataSchema>({
    resolver: zodResolver(schema),
    defaultValues: { addPosts: "" },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleBack = () => {
    setFile(null);
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: FormDataSchema) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (data.addPosts) {
        formData.append("caption", data.addPosts);
      }
      await dispatch(createNewPost(formData)).unwrap();

      reset();
      setFile(null);
      setPreview("");
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    // Overlay backdrop (giả lập modal background nếu chưa có)
    <div className="flex items-center justify-center w-full h-full">
      
      {/* Main Modal Container - Fixed Size giống Instagram Web */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 flex flex-col 
          ${file ? "w-[850px] h-[550px]" : "w-[500px] h-[550px]"}`}
      >
        
        {/* --- HEADER --- */}
        <div className="h-[45px] border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 bg-white z-10">
          {/* Nút Back (chỉ hiện khi đã chọn ảnh) */}
          {file ? (
             <ArrowLeft onClick={handleBack} className="w-6 h-6 cursor-pointer text-gray-800" />
          ) : (
             <div className="w-6"></div> // Spacer
          )}

          <span className="font-semibold text-base text-gray-800">Create new post</span>

          {/* Nút Share (chỉ hiện khi đã chọn ảnh) - Đặt ở Header giống Instagram */}
          {file ? (
            <button
              type="submit"
              disabled={loading}
              className="text-[#0095f6] font-bold text-sm hover:text-[#00376b] disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sharing..." : "Share"}
            </button>
          ) : (
            <div className="w-6"></div> // Spacer
          )}
        </div>

        {/* --- BODY --- */}
        <div className="flex flex-1 h-full overflow-hidden">
          
          {/* Left Side: Image Preview / Uploader */}
          <div className={`relative flex items-center justify-center bg-white transition-all duration-300 
            ${file ? "w-[60%] border-r border-gray-200 bg-black" : "w-full h-full"}`}>
            
            {preview ? (
              // Trạng thái đã chọn ảnh
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain" // object-contain để hiển thị toàn bộ ảnh trên nền đen
              />
            ) : (
              // Trạng thái chưa chọn ảnh (Empty State)
              <div className="flex flex-col items-center justify-center h-full gap-4 animate-in fade-in zoom-in duration-300">
                {/* Icon Media của Instagram */}
                <div className="relative">
                    <svg aria-label="Icon to represent media such as images or videos" className="text-gray-800" fill="currentColor" height="77" role="img" viewBox="0 0 97.6 77.3" width="96"><path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 19.2c-.3-4.1 2.9-7.7 7-7.9l33.8-1.9c4.1-.3 7.7 2.9 7.9 7l2.8 50.5c.3 4.1-2.9 7.7-7 7.9l-33.8 1.9c-4.1.3-7.7-2.9-7.9-7l-2.8-50.5zm53.7 52c-.3 4.1-2.9 7.7-7 7.9l-34.2 1.9c-4.1.3-7.7-2.9-7.9-7l-2.8-50.5c-.3-4.1 2.9-7.7 7-7.9l34.2-1.9c4.1-.3 7.7 2.9 7.9 7l2.8 50.5zM65 25.9l-5.6-32.5c-.3-5.7-5.3-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1z" fill="none"></path></svg>
                </div>
                
                <span className="text-xl text-gray-600 font-light">Drag photos and videos here</span>
                
                <ButtonTypeLabel onClick={() => fileInputRef.current?.click()} />
              </div>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*"
            />
          </div>

          {/* Right Side: Caption (Chỉ hiện khi đã chọn ảnh) */}
          {file && (
            <div className="w-[40%] flex flex-col bg-white">
              {/* User Info */}
              <div className="flex items-center gap-3 p-4 py-5">
                <Avatar img={userData?.profilePicture} className="w-7 h-7" />
                <span className="font-semibold text-sm text-gray-900">{userData?.username}</span>
              </div>

              {/* Textarea */}
              <div className="px-4 flex-1">
                <textarea
                  autoFocus
                  placeholder="Write a caption..."
                  {...register("addPosts")}
                  className="w-full h-full border-none outline-none resize-none text-sm placeholder:text-gray-400"
                  maxLength={2200}
                />
              </div>

              {/* Extra Tools (Visual Decor) */}
              <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
                  <div className="text-gray-400 cursor-pointer hover:text-gray-600">
                    <svg aria-label="Emoji" color="currentColor" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path></svg>
                  </div>
                  <span className="text-xs text-gray-400">0/2,200</span>
              </div>
              
              {/* Accordions giả lập (Location, Accessibility, Advanced) */}
              <div className="border-t border-gray-200">
                  <div className="flex justify-between items-center p-3 px-4 cursor-pointer hover:bg-gray-50">
                     <span className="text-sm text-gray-700">Add Location</span>
                     <svg aria-label="Down chevron icon" color="currentColor" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16"><path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" transform="rotate(180 12 12)"></path></svg>
                  </div>
                  <div className="border-t border-gray-200 flex justify-between items-center p-3 px-4 cursor-pointer hover:bg-gray-50">
                     <span className="text-sm text-gray-700">Accessibility</span>
                     <svg aria-label="Down chevron icon" color="currentColor" fill="currentColor" height="16" role="img" viewBox="0 0 24 24" width="16"><path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z" transform="rotate(180 12 12)"></path></svg>
                  </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

// Component phụ cho nút Select (để code gọn hơn)
const ButtonTypeLabel = ({ onClick }: { onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold text-sm py-1.5 px-4 rounded-[8px] mt-4 transition-colors cursor-pointer"
    >
      Select from computer
    </button>
);