import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { PaginationDto} from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProducto(@Body() createProductoDto: CreateProductDto) {
    return this.productsClient.send({cmd: 'createProduct'},createProductoDto);
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: 'findAllProducts' }, paginationDto);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'findOneProduct' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );

    // --Otra opcion--
    //try {
    // const product = await firstValueFrom(
    //   this.productsClient.send({ cmd: 'findOneProduct' }, { id }),
    //);

    //return product;
    //} catch (error) {
    //throw new RpcException(error);
    //}
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsClient.send({ cmd: 'deleteProduct' }, { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
  @Patch(':id')
  updateProduct(
    @Param('id', ParseIntPipe ) id: number,
    @Body() updatedProduct: UpdateProductDto,
  ) {
    return this.productsClient
      .send({ cmd: 'updatedProduct' }, { id,...updatedProduct })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }
}
