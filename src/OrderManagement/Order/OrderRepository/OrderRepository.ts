import { Repository } from "typeorm";
import pgDataSource from "../../../DBConfig/PostGresDataSource/PostGresDataSource";
import { Order } from "../OrderEntity/Order";
import { OrderStatus } from "../OrderEntity/OrderStatus/OrderStatus";

class OrderRepository {
  private orderRepository: Repository<Order>;
  constructor() {
    this.orderRepository = pgDataSource.getRepository(Order);
  }

  public getOrderRepository(): Repository<Order> {
    return this.orderRepository;
  }

  public async findOrderById(orderId: number): Promise<Order> {
    try {
      const order: Order = await this.orderRepository.findOne({
        relations: {
          items: true,
        },
        where: {
          id: orderId,
        },
      });
      return order;
    } catch (error) {
      console.log("Order could not be fetched");
      return null;
    }
  }

  public async findOrderIdByUserIdAndStatus(
    userId: number,
    orderStatus: OrderStatus
  ): Promise<number> {
    try {
      const order: Order = await this.orderRepository.findOne({
        relations: {
          user: true,
        },
        where: {
          user: {
            id: userId,
          },
          orderStatus: orderStatus,
        },
      });
      return order.id;
    } catch (error) {
      console.log("Order could not be fetched");
      return null;
    }
  }

  public async findOneByUserIdAndStatus(
    userId: number,
    orderStatus: OrderStatus
  ) {
    const currOrder = await this.orderRepository
      .createQueryBuilder("order")
      .innerJoin("order.user", "user")
      .addSelect(["user.name"])
      .innerJoin("order.items", "item")
      .addSelect(["item"])
      .innerJoin("item.product", "product")
      .addSelect(["product.title", "product.id"])
      .where("user.id = :userId", { userId: userId })
      .andWhere("order.orderstatus = :status", { status: orderStatus })
      .getOne();

    return currOrder;
  }

  public async findAllByUserIdAndStatus(
    userId: number,
    orderStatus: OrderStatus
  ) {
    const currOrder = await this.orderRepository
      .createQueryBuilder("order")
      .innerJoin("order.user", "user")
      .addSelect(["user.name"])
      .innerJoin("order.items", "item")
      .addSelect(["item"])
      .innerJoin("item.product", "product")
      .addSelect(["product.title", "product.id"])
      .where("user.id = :userId", { userId: userId })
      .andWhere("order.orderstatus = :status", { status: orderStatus })
      .getMany();

    return currOrder;
  }
}

const orderRepository = new OrderRepository();
export default orderRepository;
