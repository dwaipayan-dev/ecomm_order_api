import { Request, Response, Router } from "express";
import { User } from "../AuthenticationEntities/User/User";
import userRepository from "../AuthenticationRepository/UserRepository";
import userDetailsService from "../AuthenticationServices/UserDetailsService/UserDetailsService";
import bcrypt from "bcrypt";
import jwtService from "../AuthenticationServices/JWTUtils/JwtUtilsService";

const saltRounds = 10;

class AuthenticationController {
  private path = "/auth";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private pathJoiner(pathsegments: string[]): string {
    return pathsegments.join("/");
  }

  private initializeRoutes(): void {
    this.router.post(this.pathJoiner([this.path, "signup"]), this.signup);
    this.router.post(this.pathJoiner([this.path, "login"]), this.login);
  }

  public async signup(req: Request, res: Response) {
    const userEmail: string = req.body.email;
    const userPassword: string = req.body.password;
    const userName: string = req.body.name;
    let user: User = null;
    if (!!userEmail) {
      user = await userRepository.findByEmail(userEmail);
    }
    if (!!user) {
      res.status(400).send("Bad Request! User already exists!");
      return;
    }
    let userPasswordHash: string = null;
    if (!!userPassword) {
      userPasswordHash = await bcrypt.hash(userPassword, saltRounds);
    }
    if (!userPassword) {
      res.status(500).send("Internal Server error");
    }
    if (!!userName) {
      const isCreated: boolean = await userDetailsService.addUser(
        userName,
        userEmail,
        userPasswordHash
      );
      if (isCreated === true) {
        res.status(200).send("User is created");
        return;
      } else {
        res.status(401).send("User could not be created");
        return;
      }
    }
    res.status(400).send("Missing Data");
  }

  public async login(req: Request, res: Response) {
    const userEmail: string = req.body.email;
    const userPassword: string = req.body.password;
    if (!userEmail || !userPassword) {
      res.status(400).send("Missing Data");
      return;
    }
    const user: User = await userRepository.findByEmail(userEmail);
    if (!user) {
      res.status(401).send("Unauthorized! Please create an account first");
      return;
    }
    const isPasswordMatch: boolean = await bcrypt.compare(
      userPassword,
      user.passwordHash
    );
    if (isPasswordMatch === false) {
      res.status(400).send("Password not matching.");
      return;
    }
    const token = jwtService.createJwt(user.id, user.name);
    res.status(200).send({
      token,
      user: user.name,
    });
  }
}

export default AuthenticationController;
