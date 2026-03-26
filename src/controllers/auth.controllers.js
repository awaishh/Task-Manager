import User from '../models/user.models.js'
import {ApiResponse} from '../utils/api-response.js'
import {ApiError} from '../utils/api-error.js'
import {asyncHandler} from '../utils/async-handler.js'
import { emailVerificationMailgenContent, sendEmail } from '../utils/mail.js'


const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken, refreshToken}
    }catch(error){
        throw new ApiError(500,"Something went wrong while generating tokens",[])
    }
}

const registerUser = asyncHandler(async(req,res)=>{

    // STEP 1 - Get data
    const {email, username, password} = req.body

    // STEP 2 - Validate (check if fields are empty)
    if([email, username, password].some(field => field?.trim() === "")){
        throw new ApiError(400, "All fields are required", [])
    }

    // STEP 3 - Check if user already exists
    const existedUser = await User.findOne({$or:[{username},{email}]})
    if(existedUser){
        throw new ApiError(409, "Username or email already exists", [])
    }

    // STEP 4 - Create user in DB
    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified:false
    })

    // STEP 5 - Generate email verification token
    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken()
    user.emailVerificationToken = hashedToken
    user.emailVerificationExpiry = tokenExpiry
    await user.save({validateBeforeSave:false})

    // STEP 6 - Send verification email
    await sendEmail({
        email: user?.email,
        subject: "Email Verification",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${unHashedToken}`
        ),
    })

    // STEP 7 - Return response without sensitive fields
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    )

    if(!createdUser){
        throw new ApiError(500, "User registration failed", [])
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            {user: createdUser},
            "User registered successfully. Please check your email to verify your account."
        )
    )
})

export {registerUser, generateAccessAndRefreshTokens}