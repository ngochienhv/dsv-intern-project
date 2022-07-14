export interface user {
    _id: string;
    email: string;
    username: string;
    password: string;
    profile: {
        firstname: string;
        lastname: string;
        avatar: Buffer;
        description: string;
        bio: string;
        followers: string[];
        following: string[];
        bookmarks: string[];
        articles: string[];
    };
}
