export interface User {
    userID: number;
    firstName: string;
    lastName: string;
    nickname: string;
    email: string;
    photoUrl: string;
    isActive: boolean;
    isAdmin: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}