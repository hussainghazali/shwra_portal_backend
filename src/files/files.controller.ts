import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { UploadFileDto } from "./dto/upload-file.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { LoggerService } from "src/logger/logger.service";

@ApiTags("files")
@ApiBearerAuth()
@Controller("files")
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly logger: LoggerService,
    ) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto
  ) {
    try {
      this.logger.log('File Uploaded', 'FilesController');
      const createdFile = await this.filesService.create(file);
      return {
        message: "File uploaded successfully",
        file: createdFile,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error('Failed to upload file', error.stack, 'FilesController');
      throw new UnauthorizedException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }
}
