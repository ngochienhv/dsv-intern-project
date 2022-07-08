import { Request } from "express";

export interface ReqExtendUser extends Request {
    user: {
        user_id: string;
        email: string;
        iat: number;
        exp: number;
    };
}
