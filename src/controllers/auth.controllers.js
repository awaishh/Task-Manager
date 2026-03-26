import User from '../models/user.models.js'
import { ApiResponse } from '../utils/api-response.js'
import { ApiError } from '../utils/api-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import { emailVerificationMailgenContent, sendEmail } from '../utils/mail.js'


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens", [])
    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { email, username, password } = req.body

    if ([email, username, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required", [])
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existedUser) {
        throw new ApiError(409, "Username or email already exists", [])
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    })

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken()
    user.emailVerificationToken = hashedToken
    user.emailVerificationExpiry = tokenExpiry
    await user.save({ validateBeforeSave: false })

    await sendEmail({
        email: user?.email,
        subject: "Email Verification",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${unHashedToken}`
        ),
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    )

    if (!createdUser) {
        throw new ApiError(500, "User registration failed", [])
    }

    return res.status(201).json(
        new ApiResponse(
            201,
            { user: createdUser },
            "User registered successfully. Please check your email to verify your account."
        )
    )
})

const login = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Email or username is required", [])
    }

    const user = await User.findOne({ $or: [{ username }, { email }] })

    if (!user) {
        throw new ApiError(404, "User does not exist", [])
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials", [])
    }

    if (!user.isEmailVerified) {
        throw new ApiError(400, "Please verify your email first", [])
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        )
})

export { registerUser, login }