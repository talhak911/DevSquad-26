import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProductsService {
  private readonly hygraphUrl: string;
  private readonly hygraphToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.hygraphUrl = this.configService.get<string>('HYGRAPH_API_URL') ?? '';
    this.hygraphToken = this.configService.get<string>('HYGRAPH_API_TOKEN') ?? '';
  }

  async getProducts() {
    const query = `
      query GetProducts {
        products {
          id
          name
          slug
          price
          featured
          description {
            text
          }
          image {
            url
          }
        }
      }
    `;

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          this.hygraphUrl,
          { query },
          {
            headers: {
              Authorization: `Bearer ${this.hygraphToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }

      return response.data.data.products;
    } catch (error) {
      console.error('Error fetching products from Hygraph:', error.message);
      // Return empty array instead of crashing if Hygraph is not set up correctly yet
      // This helps UI load without breaking while testing integration
      return []; 
    }
  }
}
