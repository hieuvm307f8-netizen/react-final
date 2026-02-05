import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "@/store/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Avatar from "../shared/Avatar";
import { deleteProfilePicture, updateCurrentUser, changeUserPassword } from "@/store/slice/authSlice";
import { Spinner } from "../ui/spinner";

export default function EditProfileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser, loading } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    bio: currentUser?.bio || "",
  });
  const [file, setFile] = useState<File | null>(null);

  const [, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [, setPassError] = useState("");
  const [, setSuccessMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: currentUser?.fullName || "",
        bio: currentUser?.bio || "",
      });
      setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPassError("");
      setSuccessMsg("");
      setFile(null);
    }
  }, [isOpen, currentUser]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("bio", formData.bio);
    if (file) data.append("profilePicture", file);

    await dispatch(updateCurrentUser(data));
    onClose();
  };

  // const handlePasswordSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setPassError("");
  //   setSuccessMsg("");

  //   if (passData.newPassword !== passData.confirmPassword) {
  //     setPassError("Passwords do not match");
  //     return;
  //   }

  //   if (passData.newPassword.length < 6) {
  //     setPassError("Password must be 6 characters or more");
  //     return;
  //   }

  //   const result = await dispatch(changeUserPassword(passData));
  //   if (changeUserPassword.fulfilled.match(result)) {
  //     setSuccessMsg("Password changed successfully");
  //     setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  //   }
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] bg-white p-0 gap-0 rounded-xl overflow-hidden border-none shadow-2xl">
        <DialogHeader className="p-4 border-b border-gray-100 flex items-center justify-center">
          <DialogTitle className="text-base font-semibold">Edit profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col overflow-y-auto max-h-[80vh] p-4 gap-6">
          
          {/* PROFILE FORM */}
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
            {/* Header: Avatar & Change Photo Action */}
            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl">
              <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200">
                 <Avatar img={file ? URL.createObjectURL(file) : currentUser?.profilePicture} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-sm">{currentUser?.username}</span>
                <div className="flex gap-3 mt-1">
                  <label className="text-xs font-semibold text-blue-500 cursor-pointer hover:text-blue-700 transition-colors">
                    Change photo
                    <input type="file" hidden accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </label>
                  {(currentUser?.profilePicture || file) && (
                      <button 
                        type="button" 
                        onClick={() => { dispatch(deleteProfilePicture()); setFile(null); }} 
                        className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                  )}
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">Name</label>
                <input
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-gray-800 transition-all placeholder:text-gray-300"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">Bio</label>
                <textarea
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-gray-800 transition-all resize-none placeholder:text-gray-300"
                  placeholder="Bio"
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>
            </div>

            <Button 
                type="submit" 
                className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-lg h-9 text-sm" 
                disabled={loading}
            >
              {loading ? <Spinner /> : "Submit"}
            </Button>
          </form>

          {/* DIVIDER */}
          <div className="h-px bg-gray-100 w-full"></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}