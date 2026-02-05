import ProfileBody from "@/components/profile/ProfileBody";
import ProfileHeader from "@/components/profile/ProfileHeader";


export default function Profile() {
  return (
    <div className="flex flex-col w-full max-w-[935px] mx-auto mt-8 px-5 mb-8">
      <div>
        <ProfileHeader/>
      </div>
      <div className="border-t border-gray-300">
        <ProfileBody/>
      </div>
    </div>
  )
}
