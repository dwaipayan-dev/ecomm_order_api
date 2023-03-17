import { Repository } from "typeorm";
import pgDataSource from "../../../DBConfig/PostGresDataSource/PostGresDataSource";
import { Product } from "../ProductEntity/Product";

class ProdutRepository {
  private productRepository: Repository<Product>;
  constructor() {
    this.productRepository = pgDataSource.getRepository(Product);
  }

  public getProductRepository(): Repository<Product> {
    return this.productRepository;
  }

  public async findProductById(productId: number): Promise<Product> {
    try {
      const product: Product = await this.productRepository.findOneBy({
        id: productId,
      });
      return product;
    } catch (error) {
      console.log("ERROR: 404 Not Found");
      return null;
    }
  }

  public async findAllProductsCount(): Promise<number> {
    try {
      const productCount: number = await this.productRepository.count();
      return productCount;
    } catch (error) {
      console.log("ERROR: Product Count could not be fetched");
      return null;
    }
  }

  public async findAllProductsByPage(
    pageNumber: number,
    perPage: number
  ): Promise<Product[]> {
    try {
      const productsPerPage: Product[] = await this.productRepository.find({
        order: {
          id: "ASC",
        },
        skip: (pageNumber - 1) * perPage,
        take: perPage,
      });
      return productsPerPage;
    } catch (error) {
      console.log("ERROR: Could not fetch products");
      return null;
    }
  }
}

const productRepository = new ProdutRepository();
export default productRepository;
