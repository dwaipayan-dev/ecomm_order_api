import bodyParser from "body-parser";
import cors from "cors";
import express, { Application } from "express";
import AuthenticationController from "./Authentication/AuthenticationController/AuthenticationController";
import jwtAuthFilter from "./Authentication/AuthenticationMiddleware/JwtAuthFilter/JwtAuthFilter";
import OrderController from "./OrderManagement/Order/OrderController/OrderController";
import ProductController from "./OrderManagement/Product/ProductController/ProductController";

class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(jwtAuthFilter.doFilter);
    this.app.use("/", new AuthenticationController().router);
    this.app.use("/product", new ProductController().router);
    this.app.use("/order", new OrderController().router);
  }

  public getApp(): Application {
    return this.app;
  }
}

export default function init(): Application {
  return new App().getApp();
}
