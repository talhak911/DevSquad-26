import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
const { PDFParse: pdfParser } = require('pdf-parse');

@Injectable()
export class VectorService {
  private readonly logger = new Logger(VectorService.name);

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadToCloudinary(filePath: string): Promise<string> {
    this.logger.log(`Uploading ${filePath} to Cloudinary...`);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'ai-documents',
        resource_type: 'auto', // Auto-detect for PDF/Raw support
        type: 'upload',        // Ensure public delivery
      });
      return result.secure_url;
    } catch (error) {
      this.logger.error(`Cloudinary upload failed: ${error.message}`);
      throw error;
    }
  }

  async deleteFromCloudinary(url: string): Promise<void> {
    try {
      const urlParts = url.split('/');
      const uploadIndex = urlParts.indexOf('upload');
      if (uploadIndex > 0) {
        const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
        const publicId = publicIdWithExt.split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
      }
    } catch (error) {
      this.logger.warn(`Cloudinary deletion failed: ${error.message}`);
    }
  }

  async extractText(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new pdfParser({ data: dataBuffer });
      const result = await parser.getText();
      return result.text || '';
    } catch (error) {
      this.logger.error(`Text extraction failed: ${error.message}`);
      return '';
    }
  }
}
