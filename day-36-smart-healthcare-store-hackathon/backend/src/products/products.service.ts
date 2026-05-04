import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { HealthcareWorkflow } from '../ai/healthcare.workflow';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private healthcareWorkflow: HealthcareWorkflow,
  ) {}

  async findAll(category?: string) {
    const filter: any = {};
    if (category) filter.category = category;
    return this.productModel.find(filter).sort({ createdAt: -1 }).lean().exec();
  }

  async searchByTitle(query: string) {
    if (!query?.trim()) return this.findAll();
    return this.productModel
      .find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean()
      .exec();
  }

  async aiSearch(query: string) {
    return this.healthcareWorkflow.aiSearch(query);
  }

  async chat(query: string) {
    return this.healthcareWorkflow.chat(query);
  }

  async getCategories() {
    return this.productModel.distinct('category').exec();
  }

  async getProductCount() {
    return this.productModel.countDocuments().exec();
  }

  async bulkCreate(products: any[]) {
    return this.productModel.insertMany(products);
  }
}
