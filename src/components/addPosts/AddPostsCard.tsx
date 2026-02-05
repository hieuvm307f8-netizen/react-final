import { useState, useEffect } from "react";
import { X } from "lucide-react";   
import AddPosts from "./AddPosts";

type AddPostsProps = {
  trigger: React.ReactNode;
};

export default function AddPostsCard({ trigger }: AddPostsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) {
    return <div className="cursor-pointer" onClick={() => setIsOpen(true)}>{trigger}</div>;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-200"
      onClick={() => setIsOpen(false)}
    >
      <button 
        className="absolute top-4 right-4 text-white cursor-pointer p-2 hover:opacity-70 transition-opacity"
        onClick={() => setIsOpen(false)}
      >
        <X className="w-8 h-8" strokeWidth={2.5} />
      </button>

      {/* Container của Modal */}
      <div
        className="relative w-full max-w-fit h-fit flex items-center justify-center shadow-xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
       
        <AddPosts onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}