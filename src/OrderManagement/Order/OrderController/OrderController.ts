import { Request, Response, Router } from "express";
import orderService from "../OrderService/OrderService";

class OrderController {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post("/add/product/:productId", this.addProductToOrder);
    this.router.post("/place", this.placeOrder);
    this.router.get("/get/cart", this.getNewOrExistingCart);
    this.router.get("/fetch/cart", this.getCartDetails);
    this.router.get("/fetch/orders", this.getOrderHistory);
  }

  public async addProductToOrder(req: Request, res: Response) {
    const orderId: number = req.body["orderId"];
    if (!orderId) {
      res.status(400).send("Missing Data");
      return;
    }
    const productId: number = parseInt(req.params["productId"]);
    const isAdded: boolean = await orderService.addItem(orderId, productId);
    if (!isAdded) {
      res.status(400).send("Product could not be added");
      return;
    } else {
      res.status(200).send("Product Added to order");
      return;
    }
  }

  public async getNewOrExistingCart(req: Request, res: Response) {
    const userId: number = parseInt(req.headers["userId"].toString());
    const cartId: number = await orderService.getCart(userId);
    console.log(cartId);
    if (!cartId) {
      res.status(400).send("Empty/Existing cart could not be returned");
      return;
    }
    res.status(200).send({
      cartId,
    });
  }

  public async getCartDetails(req: Request, res: Response) {
    const userId: number = parseInt(req.headers["userId"].toString());
    const details = await orderService.getCartDetails(userId);
    res.status(200).send({
      details,
    });
  }

  public async getOrderHistory(req: Request, res: Response) {
    const userId: number = parseInt(req.headers["userId"].toString());
    const details = await orderService.getOrderHistory(userId);
    res.status(200).send({
      details,
    });
  }

  public async placeOrder(req: Request, res: Response) {
    const orderId: number = req.body["orderId"];
    if (!orderId) {
      res.status(400).send("Missing Data");
      return;
    }
    const result: boolean = await orderService.placeOrder(orderId);
    if (!result) {
      res.send(400).send("Order could not be placed");
      return;
    }
    res.status(200).send("Order placed successfully");
  }
}

export default OrderController;
