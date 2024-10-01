import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Headers,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderEntity } from './entities/order.entity';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('order') // Agrupación en Swagger
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' }) // Descripción de la operación
  @ApiResponse({
    status: 201,
    description: 'The order has been successfully created.',
    type: OrderEntity,
  })
  @ApiBody({
    description: `Creates a new order.
      **Required Fields**: 
      - \`total\`: The total price of the order (numeric).
      - \`buyerId\`: The ID of the user placing the order (number).
      - \`orderProducts\`: An array of products associated with this order, 
        where each product includes:
        - \`productId\`: The ID of the product (number).
        - \`quantity\`: The quantity of this product (number).`,
    type: CreateOrderDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Ensure the input data is valid.',
  })
  @ApiResponse({ status: 422, description: 'Validation error.' })
  @ApiResponse({
    status: 201,
    description: `Creates a new order. 
      **Required Fields**: 
      - \`total\`: The total price of the order (numeric).
      - \`buyerId\`: The ID of the user placing the order (number).
      - \`orderProducts\`: An array of products associated with this order, 
        where each product includes:
        - \`productId\`: The ID of the product (number).
        - \`quantity\`: The quantity of this product (number).
      **Returns**: The created order object.`,
  })
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Headers('authorization') authHeader: string,
  ): Promise<OrderEntity> {
    const token = authHeader.split(' ')[1]; // Eliminar el prefijo "Bearer"
    return this.orderService.create(createOrderDto, token);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all order' }) // Descripción de la operación
  @ApiResponse({
    status: 200,
    description: 'List of all order.',
    type: [OrderEntity],
  })
  findAll(): Promise<OrderEntity[]> {
    return this.orderService.findAll();
  }

  @Get('/byUser')
  @ApiOperation({ summary: 'Retrieve all order by user id' }) // Descripción de la operación
  @ApiResponse({
    status: 200,
    description: 'List of all order by user id.',
    type: [OrderEntity],
  })
  filter(@Headers('authorization') authHeader: string): Promise<OrderEntity[]> {
    const token = authHeader.split(' ')[1];
    return this.orderService.filter(token);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve an order by ID' }) // Descripción de la operación
  @ApiResponse({
    status: 200,
    description: 'The found order.',
    type: OrderEntity,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  findOne(@Param('id') id: number): Promise<OrderEntity> {
    return this.orderService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing order' }) // Descripción de la operación
  @ApiResponse({
    status: 200,
    description: 'The updated order.',
    type: OrderEntity,
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @ApiResponse({
    status: 422,
    description: 'Validation error. Ensure the input data is valid.',
  })
  @ApiResponse({
    status: 200,
    description: `Updates an existing order.
      **Required Fields**: 
      - \`total\`: The new total price of the order (numeric).
      - \`buyerId\`: The new ID of the user placing the order (number).
      - \`orderProducts\`: An updated array of products associated with this order, 
        where each product includes:
        - \`productId\`: The ID of the product (number).
        - \`quantity\`: The quantity of this product (number).
      **Returns**: The updated order object.`,
  })
  update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID' }) // Descripción de la operación
  @ApiResponse({
    status: 204,
    description: 'The order has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.orderService.remove(id);
  }
}
