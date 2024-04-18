import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { LoggerService } from 'src/logger/logger.service';
import { CreateTokenDTO } from './dto/create-token.dto';
import { Message, Status } from './dto/enum.dto';
import { NotificationDTO } from './dto/notifcation.dto';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: NotificationsService;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        NotificationsService,
        LoggerService,
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get<NotificationsService>(NotificationsService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addExpoTokenToDatabase', () => {
    it('should add Expo token to database', async () => {
      const createTokenDTO: CreateTokenDTO = {
        "userId": "b1aba672-be9c-4eb7-a397-ac525be9bde3",
        "expoToken": "ExpoPushToken[XXXXXXXXXXXXXXXXXXXXXX]",
        "userPhoneNumber": "966593443443"
      }; // Provide appropriate DTO data here
      const result: Message = {
        message: "Successful",
        status: Status.SUCCESSFUL
      };      
      jest.spyOn(loggerService, 'log');
      jest.spyOn(service, 'addTokenToDatabase').mockResolvedValue(result);

      const response = await controller.addExpoTokenToDatabase(createTokenDTO);

      expect(response).toBe(result);
      expect(loggerService.log).toHaveBeenCalledWith('Expo Token Created', 'NotificationsController');
    });
  });

  describe('sendNotification', () => {
    it('should send notification', async () => {
      const notificationDTO: NotificationDTO = {
          title: 'test title',
          body: 'test body',
          userPhoneNumber: '966587456578'
      }; // Provide appropriate DTO data here
      const result: Message = {
        message: "Failed: Expo token not found",
        status: Status.FAILED
      };      
      jest.spyOn(loggerService, 'log');
      jest.spyOn(service, 'sendNotification').mockResolvedValue(result);

      const response = await controller.sendNotification(notificationDTO);

      expect(response).toBe(result);
      expect(loggerService.log).toHaveBeenCalledWith('Notification Sent', 'NotificationsController');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
