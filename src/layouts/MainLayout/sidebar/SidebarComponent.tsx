import { ActivitySquare, AlertTriangle, Bookmark, CompassIcon, Heart, Home, Instagram, Menu, PlaySquareIcon, Plus, Search, Send, Settings, Sun } from "lucide-react"
import {NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import Avatar from "@/components/shared/Avatar";
import SearchSidebar from "@/components/sidebar/SearchSidebar";
import { Spinner } from "@/components/ui/spinner";
import AddPostsCard from "@/components/addPosts/AddPostsCard";

export function SidebarComponent() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const navigate = useNavigate();

  const itemsMenu = [
    { title: "Settings", url: "/settings", icon: Settings },
    { title: "Your activity", url: "/activity", icon: ActivitySquare },
    { title: "Saved", url: "/saved", icon: Bookmark },
    { title: "Switch Appearance", url: "", icon: Sun },
    { title: "Report a problem", url: "/report", icon: AlertTriangle },
  ]
  const handleLogout = () => {
    localStorage.clear()
    if (localStorage.length === 0) {
      navigate("/login")
      alert("đăng xuất thành công")
    }
  }

  return (
    <>
      <Sidebar className="z-50">
        <SidebarContent className="bg-white border-r">
          <SidebarGroup className="pl-5">
            <SidebarGroupLabel className="logo text-2xl mt-5 mb-10 h-10">
              {isSearchOpen ? (<div className="mt-2"><Instagram /></div>) : (<NavLink to="/">Instagram</NavLink>)}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex gap-6">
                <SidebarMenuItem>
                  <NavLink to="/">
                    <SidebarMenuButton>
                      <div className="flex gap-4 items-center cursor-pointer">
                        <Home size={25} />
                        <span className={`text-[120%] transition-opacity duration-200 ${isSearchOpen ? 'hidden' : 'block'}`}>Home</span>
                      </div>
                    </SidebarMenuButton>
                  </NavLink>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsSearchOpen(true)} className="cursor-pointer">
                    <div className="flex gap-4 items-center">
                      <Search size={25} className={isSearchOpen ? "stroke-[3px]" : ""} />
                      <span className={`text-[120%] transition-opacity duration-200 ${isSearchOpen ? 'hidden' : 'block'}`}>Search</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <NavLink to="/explore">
                    <SidebarMenuButton>
                      <div className="flex gap-4 items-center cursor-pointer">
                        <CompassIcon size={25} />
                        <span className={`text-[120%] transition-opacity duration-200 ${isSearchOpen ? 'hidden' : 'block'}`}>Explore</span>
                      </div>
                    </SidebarMenuButton>
                  </NavLink>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <NavLink to="/reels">
                    <SidebarMenuButton>
                      <div className="flex gap-4 items-center cursor-pointer">
                        <PlaySquareIcon size={25} />
                        <span className={`text-[120%] transition-opacity duration-200 ${isSearchOpen ? 'hidden' : 'block'}`}>Reels</span>
                      </div>
                    </SidebarMenuButton>
                  </NavLink>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <NavLink to="/messages">
                    <SidebarMenuButton>
                      <div className="flex gap-4 items-center cursor-pointer">
                        <Send size={25} />
                        <span className={`text-[120%] transition-opacity duration-200 ${isSearchOpen ? 'hidden' : 'block'}`}>Messages</span>
                      </div>
                    </SidebarMenuButton>
                  </NavLink>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <NavLink to="/notifications">
                    <SidebarMenuButton>
                      <div className="flex gap-4 items-center cursor-pointer">
                        <Heart size={25} />
                        <span className={`text-[120%] transition-opacity duration-200 ${isSearchOpen ? 'hidden' : 'block'}`}>Notifications</span>
                      </div>
                    </SidebarMenuButton>
                  </NavLink>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <AddPostsCard
                      trigger={
                        <div className="flex items-center gap-2 cursor-pointer ml-2 cursor-pointer">
                          <div className="flex gap-4 items-center">
                            <Plus size={25} />
                            <span className={`text-[120%] transition-opacity duration-200 ${isSearchOpen ? 'hidden' : 'block'}`}>Create</span>
                          </div>
                        </div>
                      }
                    />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  {currentUser?._id ? (
                    <NavLink to={`/profile/${currentUser._id}`}>
                      <SidebarMenuButton>
                        <div className="flex gap-4 items-center cursor-pointer">
                          <Avatar img={currentUser?.profilePicture} className="w-6 h-6 object-cover" />
                          <span className={`text-[120%] transition-opacity duration-200 ${isSearchOpen ? 'hidden' : 'block'}`}>
                            Profile
                          </span>
                        </div>
                      </SidebarMenuButton>
                    </NavLink>
                  ) : (
                    <Spinner />
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="flex flex-col gap-10 bg-white border-r">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-full justify-start cursor-pointer hover:bg-gray-100">
                <div className="flex gap-5 ml-2 items-center">
                  <Menu size={25} />
                  <span className={`text-[120%] transition-opacity duration-200 ${isSearchOpen ? 'hidden' : 'block'}`}>More</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-65 flex flex-col gap-3 ml-5 mb-2">
              {itemsMenu.map((itemsmenu) => (
                <DropdownMenuItem key={itemsmenu.title} className="cursor-pointer p-4">
                  <NavLink to={itemsmenu.url} className="flex items-center gap-4 w-full">
                    <itemsmenu.icon size={20} />
                    <span>{itemsmenu.title}</span>
                  </NavLink>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="h-1" />
              <DropdownMenuItem className="pl-5 flex items-center cursor-pointer p-4">Switch accounts</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="pl-5 flex items-center mb-3 cursor-pointer p-4" onClick={handleLogout}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SearchSidebar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}