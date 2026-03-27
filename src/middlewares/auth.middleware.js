import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized Request");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded?._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpires"
    );

    if (!user) {
        throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
});