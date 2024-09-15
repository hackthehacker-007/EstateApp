import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user in db
    const user = await prisma.User.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // validate user
    const user = await prisma.User.findUnique({
      where: { username },
    });

    if (!user) res.status(400).json({ message: "Invalid credentials!" });

    //validate password
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) res.status(400).json({ message: "Invalid credentials!" });

    //generate token

    //res.setHeader("Set-Cookie", "test=" + "myValue").json("success!");

    const age = 1000 * 60 * 60 * 24;

    const jwtToken = jwt.sign(
      {
        id: user.Id,
      },
      process.env.JWT_SECERT_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", jwtToken, {
        httpOnly: true,
        //secure:true,
        maxAge: age,
      })
      .status(200)
      .json({ userInfo });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Logout successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Failed to logout!" });
  }
};
