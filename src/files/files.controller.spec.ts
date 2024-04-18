import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { LoggerService } from 'src/logger/logger.service';
import { UploadFileDto } from './dto/upload-file.dto';

describe('FilesController', () => {
  let controller: FilesController;
  let filesService: FilesService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    filesService = module.get<FilesService>(FilesService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should upload file', async () => {
      const file = {} as Express.Multer.File;
      const uploadFileDto = {} as UploadFileDto; // Provide appropriate DTO data here
      const result = {
        "filename": "1706260257973.jpeg",
        "data": "2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCAMgAyADASIAAhEBAxEB/8QAHAABAAICAwEAAAAAAAAAAAAAAAECAwQFBgcI/",
        "id": "60886041-ef4f-405c-96f9-4b4b30fd0682"
    }
      jest.spyOn(filesService, 'create').mockResolvedValue(result);

      const response = await controller.create(file, uploadFileDto);

      expect(response).toEqual(result);
      expect(filesService.create).toHaveBeenCalledWith(file);
      expect(loggerService.log).toHaveBeenCalledWith('File Uploaded', 'FilesController');
    });
  });
});
