import type { TUsersData } from "@/type/user";

export const userData: TUsersData = {
    id: 0,
    username: "",
    avatarUrl: "",
    posts: 0,
    followers: 0,
    following: 0,
    bio: "",
    content: ""
};
export const otherUsersData: TUsersData[] = [
    {
        id: 1,
        username: "test 1",
        avatarUrl: "https://picsum.photos/200/300",
        posts: 10,
        followers: 2,
        following: 4,
        bio: "test 1",
        content: "Đây là user profile của test 1"
    },
    {
        id: 2,
        username: "test 2",
        avatarUrl: "https://picsum.photos/200/300",
        posts: 8,
        followers: 5,
        following: 13,
        bio: "test 2",
        content: "Đây là user profile test 2"
    }
]
