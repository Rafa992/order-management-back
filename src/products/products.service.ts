import { Injectable } from '@nestjs/common'
import { products } from 'src/data/products'
import { PrismaService } from 'src/prisma.service'
import { EditOrderDto, OrderDto } from './dto/saveProducts.dto'

@Injectable()
export class ProductsService {
	constructor(private readonly prisma: PrismaService) {}

	async createProducts() {
		try {
			const productsData = products

			const createdProducts = await Promise.all(
				productsData.map(async item => {
					return this.prisma.products.create({
						data: {
							title: item.title,
							description: item.description,
							price: item.price,
							newPrice: item.price
						}
					})
				})
			)
			return createdProducts
		} catch (error) {
			throw new Error('Error creating static products: ' + error.message)
		}
	}

	async getAllProducts() {
		try {
			const allProducts = await this.prisma.products.findMany()
			return allProducts
		} catch (error) {
			throw new Error('Error fetching all products: ' + error.message)
		}
	}

	async getProductById(id: string) {
		try {
			return await this.prisma.products.findUnique({
				where: { id }
			})
		} catch (error) {
			throw new Error('Error fetching product by id: ' + error.message)
		}
	}

	async createOrder(orderData: OrderDto) {
		try {
			return await this.prisma.order.create({
				data: {
					status: orderData.status,
					totalAmount: orderData.totalAmount,
					totalPrice: orderData.totalPrice,
					address: orderData.address,
					paymentMethod: orderData.paymentMethod,
					comment: orderData.comment,
					userId: orderData.userId,
					username: orderData.username,
					orderNumber: orderData.orderNumber,
                    products: orderData.products,
				}
			})
		} catch (error) {
			throw new Error('Error creating order: ' + error.message)
		}
	}
	async editOrder(orderData: EditOrderDto) {
		try {
			return await this.prisma.order.update({
				where: {id: orderData.id},
				data: {
					status: orderData.status,
					totalAmount: orderData.totalAmount,
					totalPrice: orderData.totalPrice,
					address: orderData.address,
					paymentMethod: orderData.paymentMethod,
					comment: orderData.comment,
					userId: orderData.userId,
					username: orderData.username,
					orderNumber: orderData.orderNumber,
                    products: orderData.products,
				}
			})
		} catch (error) {
			throw new Error('Error edit order: ' + error.message)
		}
	}

	async getAllOrders() {
		try {
			return await this.prisma.order.findMany()
		} catch (error) {
			throw new Error('Error creating order: ' + error.message)
		}
	}

	async deleteOrder(id: string) {
		try {
			return await this.prisma.order.delete({
				where:{id}
			})
		} catch (error) {
			throw new Error('Error delete order: ' + error.message)
		}
	}
}
