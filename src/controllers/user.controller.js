import { userSignup, userLogin } from "../utils/types.js";
import { User } from "../models/user.model.js";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("somthing went wrong", error.message);
  }
};

const signupUser = async (req, res) => {
  try {
    const payload = req.body;
    const validatePayload = userSignup.safeParse(payload);
    if (!validatePayload) {
      res.status(400).send({ msg: "Invalid user input format" });
    } else {
      const { username, password, email } = payload;
      const userExist = await User.findOne({
        $or: [{ username }, { password }],
      });
      if (userExist) {
        res.status(400).send({ msg: "User with this username already exist" });
        console.log(userExist);
        return;
      } else {
        const createNewUser = await User.create({ username, password, email });
        const user = await User.findById(createNewUser._id).select(
          "-password -refreshToken"
        );
        res.status(200).send({ msg: "New user created successfully" });
      }
    }
  } catch (error) {
    console.log("something went wrong", error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const payload = req.body;
    const validatePayload = userLogin.safeParse(payload);
    if (!validatePayload) {
      return res.status(400).send({ msg: "Input is not of correct format" });
    } else {
      const { email, password } = payload;
      const user = await User.findOne({ email });
      if (!user) return res.status(404).send({ msg: "User does not exist" });
      const isPasswordValid = await user.isPasswordCorrect(password);
      if (!isPasswordValid)
        return res.status(401).send({ msg: "invalid user credentials" });
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );
      const loggedinUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
      const options = { httpOnly: true, secure: true };
      res
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .send({ loggedinUser, accessToken, refreshToken });
    }
  } catch (error) {
    console.log("something went wrong", error.message);
  }
};

const logoutUser = async (req, res) => {
  try {
    // remove the refresh token from the user model
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
    // clear the cookies
    const options = { httpOnly: true, secure: true };
    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .send({ msg: "user loggedout" });
  } catch (error) {
    console.log("something went wrong", error.message);
  }
};

const checkUserAuthState = (req, res) => {
  return res.status(200).send({ msg: "user is authenticated" });
};

export { signupUser, loginUser, logoutUser, checkUserAuthState };
