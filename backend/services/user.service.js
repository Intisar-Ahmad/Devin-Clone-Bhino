import userModel from "../models/user.model.js";

export const createUser = async ({email,password}) => {
   try {
      if (!email || !password) {
         throw new Error("Email and password are required");
      }

      const normalizedEmail = String(email).trim().toLowerCase();

      const existing = await userModel.findOne({ email: normalizedEmail });
      if (existing) {
         throw new Error("A user with that email already exists");
      }

      const user = await userModel.create({ email: normalizedEmail, password });

      return user;
   } catch (error) {
      console.error(error);
      if (error && (error.code === 11000 || (error.keyValue && error.keyValue.email))) {
         throw new Error("A user with that email already exists");
      }
      throw error;
   }
}

export const escapeRegex = (text = "") => {
  // escape special regex chars so user input is treated as literal
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

