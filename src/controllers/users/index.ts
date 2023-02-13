import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { ErrorType, UserDataType } from "../../typings";
import { createData, getAllData } from "../../utils";
import { compare, toHash } from "../../utils/passwordHashing";
import { generateToken } from "../../utils/token";
import { loginUserSchema, userSchema } from "../../utils/validation/users";

export const getAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const getAllUsersData: UserDataType[] = getAllData("src/database/users.json");
    res.send({
      success: true,
      path: req.url,
      data: getAllUsersData,
    });
  } catch (error) {
    const err = error as ErrorType;
    return res.status(500).send({
      status: "error",
      error: err.message,
    });
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const getAllUsersData: UserDataType[] = getAllData("src/database/users.json");
  const userData = req.body;

  const error: any = userSchema.safeParse(userData);

  try {
    if (error.success === false) {
      return res.status(400).send({
        success: false,
        path: req.url,
        message: error.error.issues[0].message,
      });
    }

    const getExistingUser = getAllUsersData.find(
      (user: { email: string }) => user.email === userData.email
    );

    if (getExistingUser) {
      return res.status(409).send({
        status: "error",
        path: req.url,
        message: `User with the email - '${userData.email}' already exist`,
      });
    }

    let hashedPassword = await toHash(userData.password);

    const allUserData: UserDataType = {
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const token = generateToken(allUserData);

    getAllUsersData.push(allUserData);

    createData("src/database/users.json", getAllUsersData);

    res.status(201).send({
      status: "success",
      path: req.url,
      message: `New user with email - ${userData.email} added successfully`,
      data: allUserData,
      token,
    });
  } catch (error) {
    const err = error as ErrorType;
    return res.status(500).send({
      status: "error",
      error: err.message,
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const getAllUsersData: UserDataType[] = getAllData("src/database/users.json");
  const userData = req.body;
  const error: any = loginUserSchema.safeParse(userData);

  if (error.success === false) {
    return res.status(400).send({
      status: "error",
      path: req.url,
      message: error.error.issues[0].message,
    });
  }
  try {
    const getExistingUser = getAllUsersData.find(
      (user: { email: string }) => user.email === userData.email
    );

    if (!getExistingUser) {
      return res.status(409).send({
        success: false,
        path: req.url,
        message: `Email or password is incorrect`,
      });
    }

    if (getExistingUser) {
      const { id, firstname, lastname, email, gender } = getExistingUser;

      const token = generateToken({
        id,
        firstname,
        lastname,
        email, 
        gender,
      });

      const verifyPassword = await compare(
        getExistingUser.password,
        userData.password
      );

      if (!verifyPassword) {
        return res.status(401).send({
          status: "error",
          path: req.url,
          message: `Email or password is incorrect`,
        });
      }

      if (verifyPassword) {
        return res.status(201).send({
          status: "success",
          path: req.url,
          data: getExistingUser,
          token,
        });
      }
    }
  } catch (error) {
    const err = error as ErrorType;
    return res.status(500).send({
      status: "error",
      error: err.message,
    });
  }
};
