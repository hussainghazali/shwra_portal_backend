import { Test, TestingModule } from '@nestjs/testing';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';

describe('LoggerController', () => {
  let controller: LoggerController;
  let loggerService: LoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoggerController],
      providers: [LoggerService],
    }).compile();

    controller = module.get<LoggerController>(LoggerController);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getInfoLog', () => {
    it('should log an INFO message', () => {
      const loggerSpy = jest.spyOn(loggerService, 'log');
      const response = controller.getInfoLog();

      expect(loggerSpy).toHaveBeenCalledWith('This is an INFO log message from the LoggerController.', 'LoggerController');
      expect(response).toBe('Logged an INFO message.');
    });
  });

  describe('getErrorLog', () => {
    it('should log an ERROR message', () => {
      const loggerSpy = jest.spyOn(loggerService, 'error');
      const response = controller.getErrorLog();

      expect(loggerSpy).toHaveBeenCalledWith('This is an ERROR log message from the LoggerController.', null, 'LoggerController');
      expect(response).toBe('Logged an ERROR message.');
    });
  });
});
