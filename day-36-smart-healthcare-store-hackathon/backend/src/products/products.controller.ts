import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.productsService.findAll(category);
  }

  @Get('search')
  search(@Query('q') q: string) {
    return this.productsService.searchByTitle(q);
  }

  @Get('ai-search')
  aiSearch(@Query('q') q: string) {
    return this.productsService.aiSearch(q);
  }

  @Post('chat')
  chat(@Body('message') message: string) {
    return this.productsService.chat(message);
  }

  @Get('categories')
  getCategories() {
    return this.productsService.getCategories();
  }
}
