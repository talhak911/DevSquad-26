import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  Logger,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { AIService } from '../ai/ai.service';
import { VectorService } from '../ai/vector.service';
import { diskStorage } from 'multer';
import * as path from 'path';

@Controller('documents')
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly aiService: AIService,
    private readonly vectorService: VectorService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          return cb(new BadRequestException('Only PDF files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // 1. Upload to Cloudinary
      console.log(`Uploading file to Cloudinary: ${file.path}`);
      const cloudinaryUrl = await this.vectorService.uploadToCloudinary(file.path);
      console.log(`File uploaded to Cloudinary successfully: ${cloudinaryUrl}`);
        
      // 2. Save in Database
      console.log(`Saving file record to database: ${file.path}`);
      const document = await this.documentsService.create({
        ...file,
        cloudinaryUrl, 
      });
      console.log(`File saved to database successfully: ${document._id}`);

      // 3. Process analysis in background
      this.analyzeInBackground((document as any)._id.toString(), file.path, cloudinaryUrl);
      return document;
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  private async analyzeInBackground(id: string, filePath: string, cloudinaryUrl: string) {
    this.logger.log(`[Analysis] Starting background analysis for document ${id}`);
    try {
      // Step 1: Extract full text directly
      const fullText = await this.vectorService.extractText(filePath);

      // Step 2: Call AIService for analysis with full text context
      this.logger.log(`[Analysis] Calling AIService.chat with ${fullText.length} chars...`);
      const result = await this.aiService.chat(
        "Analyze this document. Identify the document type, provide an executive summary, and key highlights.",
        filePath,
        id,
        fullText,
        cloudinaryUrl
      );
      
      const text = result.finalOutput || '';
      
      // Parsing logic remains the same
      const typeMatch = text.match(/TYPE:\s*([^\n]+)/i) || text.match(/document type:\s*([^\n]+)/i) || text.match(/type:\s*([^\n]+)/i);
      const summaryMatch = text.match(/EXECUTIVE SUMMARY:([\s\S]*?)(?=HIGHLIGHTS:|$)/i) || text.match(/summary:([\s\S]*?)(?=highlights:|$)/i);
      const highlightsMatch = text.match(/HIGHLIGHTS:([\s\S]*?)(?=ENTITIES:|$)/i) || text.match(/highlights:([\s\S]*?)(?=entities:|$)/i);
      const entitiesMatch = text.match(/ENTITIES:([\s\S]*?)$/i) || text.match(/entities:([\s\S]*?)$/i);
      
      const highlights = highlightsMatch?.[1]?.split('\n')?.map(line => line.replace(/^[-*•]\s*/, '').trim())?.filter(line => line.length > 0) || [];
      const entities = entitiesMatch?.[1]?.split(/,|\n/)?.map(e => e.replace(/^[-*•]\s*/, '').trim())?.filter(e => e.length > 0) || [];

      await this.documentsService.updateAnalysis(id, {
        type: typeMatch?.[1]?.trim() || 'Unknown',
        summary: summaryMatch?.[1]?.trim() || text,
        highlights: highlights.slice(0, 5),
        entities: entities.slice(0, 10),
      });
      this.logger.log(`[Analysis] Analysis completed successfully for ${id}`);
    } catch (e) {
      this.logger.error(`[Analysis] Background analysis failed: ${e.message}`);
      await this.documentsService.updateStatus(id, 'error');
    }
  }

  @Get()
  async findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.documentsService.findOne(id);
  }

  @Post(':id/chat')
  async chat(@Param('id') id: string, @Body('message') message: string) {
    const document = await this.documentsService.findOne(id);
    if (!document) throw new NotFoundException('Document not found');

    // Extract text again for chat or pass it from somewhere else
    const fullText = await this.vectorService.extractText(document.path);

    return this.aiService.chat(message, document.path, id, fullText, document.cloudinaryUrl);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const document = await this.documentsService.findOne(id);
    if (!document) throw new NotFoundException('Document not found');

    try {
      if (document.cloudinaryUrl) {
        await this.vectorService.deleteFromCloudinary(document.cloudinaryUrl);
      }
      await this.documentsService.delete(id);
      return { message: 'Document deleted successfully' };
    } catch (error) {
      this.logger.error(`Deletion failed: ${error.message}`);
      throw new BadRequestException(`Deletion failed: ${error.message}`);
    }
  }
}
