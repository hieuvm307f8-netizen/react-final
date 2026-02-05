export type TUser = {
    name: string;
};

export interface IUser2 {
    name: string;
}

export type TUsersData = {
    id: number | null;
    username: string
    avatarUrl: string
    posts: number;
    followers: number;
    following: number;
    bio: string
    content: any
}

