import { Document } from 'mongoose';
export interface IUser extends Document {
    id: string;
    username: string;
    email: string;
    password: string;
}
export interface AuthRequest extends Request {
    userId?: string;
    token?: string;
    body: any;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}
export interface ListRequest {
    listData: string;
}
export interface UpdateListRequest {
    id: string;
    listData: string;
}
//# sourceMappingURL=index.d.ts.map