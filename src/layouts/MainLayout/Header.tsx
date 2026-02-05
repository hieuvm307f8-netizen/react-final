import Avatar from "@/components/shared/Avatar";
import type { THeaderAvatar } from "@/type/headerAvatar";

const headerAvatar: THeaderAvatar[] = [
    {
        id: 1,
        img: "https://picsum.photos/200/300/?random"
    },
    {
        id: 2,
        img: "https://picsum.photos/200/300/?random"
    }
    ,{
        id: 3,
        img: "https://picsum.photos/200/300/?random"
    },
    {
        id: 4,
        img: "https://picsum.photos/200/300/?random"
    },
    {
        id: 5,
        img: "https://picsum.photos/200/300/?random"
    }
]

export default function Header() {
  return (
    <div className="flex">
        <div className="flex w-fit gap-5">
            {headerAvatar.map((headeravatar => (
                <div key={headeravatar.id} className="w-[30%] h-auto">
                    <Avatar img={headeravatar.img}/>
                </div>
            )))}

        </div>
    </div>
  )
}
