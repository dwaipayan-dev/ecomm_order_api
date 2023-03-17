import { User } from "../../../Authentication/AuthenticationEntities/User/User";
import userDetailsService from "../../../Authentication/AuthenticationServices/UserDetailsService/UserDetailsService";
import { Item } from "../../Item/Item";
import { Product } from "../../Product/ProductEntity/Product";
import productRepository from "../../Product/ProductRepository/ProductRepository";
import { Order } from "../OrderEntity/Order";
import { OrderStatus } from "../OrderEntity/OrderStatus/OrderStatus";
import orderRepository from "../OrderRepository/OrderRepository";

class OrderService {
  public async addItem(orderId: number, productId: number): Promise<boolean> {
    const order: Order = await orderRepository.findOrderById(orderId);
    if (!order) {
      return false;
    }
    const product: Product = await productRepository.findProductById(productId);
    if (!product) {
      return false;
    }
    const item: Item = new Item();
    item.product = product;
    order.items = [...order.items, item];
    try {
      await orderRepository.getOrderRepository().save(order);
      return true;
    } catch (error) {
      console.log("Item could not be added!");
      return false;
    }
  }

  public async getCart(userId: number): Promise<number> {
    const cartOrderId: number =
      await orderRepository.findOrderIdByUserIdAndStatus(
        userId,
        OrderStatus.INCOMPLETE
      );
    if (!cartOrderId) {
      const order: Order = new Order();
      order.orderStatus = OrderStatus.INCOMPLETE;
      const user: User = await userDetailsService.loadUserDetails(userId);
      if (!user) {
        console.log("Empty cart could not be generated");
        return null;
      }
      order.user = user;
      try {
        await orderRepository.getOrderRepository().save(order);
        return order.id;
      } catch (error) {
        console.log("Empty Cart could not be persisted");
        return null;
      }
    } else {
      return cartOrderId;
    }
  }

  public async getCartDetails(userId: number) {
    return await orderRepository.findOneByUserIdAndStatus(
      userId,
      OrderStatus.INCOMPLETE
    );
  }

  public async placeOrder(orderId: number): Promise<boolean> {
    const order: Order = await orderRepository.findOrderById(orderId);
    if (!order) {
      return false;
    }
    order.orderStatus = OrderStatus.PLACED;
    try {
      await orderRepository.getOrderRepository().save(order);
      return true;
    } catch (error) {
      console.log("Order could not be placed!");
      return false;
    }
  }

  public async getOrderHistory(userId: number) {
    return await orderRepository.findAllByUserIdAndStatus(
      userId,
      OrderStatus.PLACED
    );
  }
}

const orderService: OrderService = new OrderService();
export default orderService;
