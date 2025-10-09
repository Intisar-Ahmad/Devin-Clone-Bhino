import userModel from "../models/user.model.js";
import { createUser } from "../services/user.service.js";
import {  validationResult } from "express-validator";

export const registerUserController = async (req, res) => {
      const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await createUser(req.body);

        const token = await user.generateAuthToken();

       

        res.status(201).json({ user, token });

    } catch (error) {
        res.status(400).send(error.message);
    }

}


export const loginUserController = async (req, res) => {
 const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        const {email,password} = req.body;
        if(!email || !password){
            throw new Error("Email and password are required");
        }


        const user = await userModel.findOne({email}).select('+password');

        if(!user){
          return  res.status(401).json({errors:"Invalid Credentials"})
        }

        const isMatch = await user.comparePassword(password);

        

       if(!isMatch){
           return res.status(401).json({errors:"Invalid Credentials"})
       }

       const token = await user.generateAuthToken();

       res.status(200).json({user,token})
       

    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const profileController = async (req , res) => {
   console.log(req.user);

   res.status(200).json({
    user:req.user
   })
}