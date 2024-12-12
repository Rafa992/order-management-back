import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductsService } from './products.service';
import {EditOrderDto, OrderDto} from './dto/saveProducts.dto'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('static')
  async createProducts() {
    return this.productsService.createProducts();
  }

  @Auth()
  @Get('all')
  async getAllProduct() {
    return this.productsService.getAllProducts()
  }

  @Auth()
  @Post('id')
  async getProductById(@Body('id') id: string) {
    return this.productsService.getProductById(id)
  }

  @Auth()
  @Post('create-order')
  async saveProduct(@Body() orderData: OrderDto) {
    return await this.productsService.createOrder(orderData);
  }

  @Auth()
  @Get('getAll-orders')
  async getAllOrders() {
    return await this.productsService.getAllOrders();
  }

  @Auth()
  @Put('edit-orders')
  async editOrder(@Body() orderData: EditOrderDto) {
    return await this.productsService.editOrder(orderData);
  }

  @Auth()
  @Delete('delete-order/:id')
  async deleteOrder(@Param("id") orderId: string) {
    return await this.productsService.deleteOrder(orderId);
  }
}
