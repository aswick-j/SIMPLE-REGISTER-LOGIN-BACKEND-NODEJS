import users from "../model/users.js";

import bcrypt from "bcryptjs";

import fs from "fs";

import jwt from "jsonwebtoken";

export const RegisterController = async (req, res) => {
  const { username, email, password } = req.body;

  const data = new users(req.body);

  let user = await users.findOne({ email });
  try {
    if (data.email !== user?.email) {
      await data.save();
      res.status(200).json({
        status: 200,
        message: "user added successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        messgae: "Email Already Registered",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "User Insert Failed",
    });
  }
};

export const LoginController = async (req, res) => {
  const { email, password } = req.body;

  const data = new users(req.body);

  let emailID = await users.findOne({ email });

  const decryptpass = await bcrypt.compare(data.password, emailID.password);

  try {
    if (emailID.email !== data.email) {
      res.status(400).json({
        status: 400,
        message: "Email Not Found Please Register",
      });
    } else {
      if (decryptpass === true) {
        const privateKey = "aasfgfgjk%hdnn9Onne";

        const token = jwt.sign({ emailID }, privateKey,{});
        console.log(token);

        res.status(200).json({
          status: 200,
          message: "User Login Success",
          token: token,
        });
      } else {
        res.status(400).json({
          status: 400,
          message: "Incorrect Password",
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      message: "Login Failed",
    });
  }
};
