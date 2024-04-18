import { Body, Controller, Delete, HttpStatus, Param, Post, Put, UnauthorizedException } from "@nestjs/common";
import { CreateTokenDTO } from "./dto/create-token.dto";
import { NotificationsService } from "./notifications.service";
import { NotificationDTO } from "./dto/notifcation.dto";
import { ApiBearerAuth, ApiParam, ApiTags } from "@nestjs/swagger";
import { ReadNotificationDTO } from "./dto/read-notification.dto";
import { AcceptEmergencyDTO } from "./dto/accept-emergency.dto";
import { LoggerService } from "src/logger/logger.service";

@ApiTags("notifications")
@ApiBearerAuth()
@Controller("notifications")
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly logger: LoggerService,
    ) {}

  @Post("create-expo-token")
  async addExpoTokenToDatabase(@Body() createTokenDTO: CreateTokenDTO) {
    try {
      this.logger.log('Expo Token Created', 'NotificationsController');
      const result = await this.notificationsService.addTokenToDatabase(createTokenDTO);
      return {
        message: "Expo token created successfully",
        data: result,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      this.logger.error('Failed to create Expo token', error.stack, 'NotificationsController');
      throw new UnauthorizedException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Post("send-notification")
  async sendNotification(@Body() notificationDTO: NotificationDTO) {
    try {
      this.logger.log('Notification Sent', 'NotificationsController');
      await this.notificationsService.sendNotification(notificationDTO);
      return {
        message: "Notification sent successfully",
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('Failed to send notification', error.stack, 'NotificationsController');
      throw new UnauthorizedException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Put("read-notification")
  async readNotification(@Body() readNotificationDTO: ReadNotificationDTO) {
    try {
      this.logger.log('Notification Read', 'NotificationsController');
      const result = await this.notificationsService.readNotification(readNotificationDTO);
      return {
        message: "Notification read successfully",
        data: result,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('Failed to read notification', error.stack, 'NotificationsController');
      throw new UnauthorizedException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Delete("revoke-notification-access/:userEmail")
  @ApiParam({ name: "userEmail", type: "string" })
  @Post('revoke-access/:userEmail')
  async revokeNotificationAccess(@Param("userEmail") userEmail: string) {
    try {
      this.logger.log('Notification Access Revoke', 'NotificationsController');
      await this.notificationsService.revokeNotificationAccess(userEmail);
      return {
        message: "Notification access revoked successfully",
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('Failed to revoke notification access', error.stack, 'NotificationsController');
      throw new UnauthorizedException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }

  @Delete("delete-notification/:notificationId")
  @ApiParam({ name: "notificationId", type: "string" })
  @Post('delete/:notificationId')
  async deleteNotification(@Param("notificationId") notificationId: string) {
    try {
      this.logger.log('Notification Deleted', 'NotificationsController');
      await this.notificationsService.deleteNotification(notificationId);
      return {
        message: "Notification deleted successfully",
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.logger.error('Failed to delete notification', error.stack, 'NotificationsController');
      throw new UnauthorizedException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'An error occurred while processing your request',
      });
    }
  }
}
