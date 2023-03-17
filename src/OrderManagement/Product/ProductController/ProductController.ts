import { Request, Response, Router } from "express";
import { Product } from "../ProductEntity/Product";
import productRepository from "../ProductRepository/ProductRepository";

const perPage = 12;
class ProductController {
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/:productId", this.getProduct);
    this.router.get("/find/total", this.getProductCount);
    this.router.get("/get/:pageNumber", this.getProductsOnPage);
  }

  public async getProduct(req: Request, res: Response) {
    const productId: number = parseInt(req.params["productId"]);
    const product: Product = await productRepository.findProductById(productId);
    if (!product) {
      res.status(400).send("Cannot Fetch Product");
      return;
    }
    res.status(200).send(product);
  }

  public async getProductCount(req: Request, res: Response) {
    const count: number = await productRepository.findAllProductsCount();
    if (!count) {
      res.status(400).send("Cannot Fetch Product Count");
      return;
    }
    res.status(200).send({
      count,
    });
  }

  public async getProductsOnPage(req: Request, res: Response) {
    const pageNumber: number = parseInt(req.params["pageNumber"]);
    let productsPerPage: Product[] =
      await productRepository.findAllProductsByPage(pageNumber, perPage);
    if (!productsPerPage) {
      res.status(400).send(`Cannot Fetch Products for page ${pageNumber}`);
      return;
    }
    res.status(200).send({
      page: productsPerPage,
    });
  }
}

export default ProductController;
