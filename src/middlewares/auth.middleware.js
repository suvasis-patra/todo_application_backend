import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const userAuth = async (req, res, next) => {
  // get the token from the cookies
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).send({ msg: "Unauthorized request" });
    // decode the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) return res.status(401).send({ msg: "Invalid token" });
    // find the user based on the decodedToken
    const user = await User.findById(decodedToken);
    // send the user in the request body for the next route
    req.user = user;
    next();
  } catch (error) {
    console.log("something went wrong", error.message);
  }
};

export { userAuth };
