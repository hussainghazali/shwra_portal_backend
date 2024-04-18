import { Injectable } from "@nestjs/common";
import { Expo } from "expo-server-sdk";
import { CreateTokenDTO } from "./dto/create-token.dto";
import { NotificationDTO } from "./dto/notifcation.dto";
import { Message, Status } from "./dto/enum.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Notification } from "./entites/notification.entity";
import { ExpoToken } from "./entites/expoToken.entity";
import { ReadNotificationDTO } from "./dto/read-notification.dto";
import { AcceptEmergencyDTO } from "./dto/accept-emergency.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectRepository(ExpoToken)
    private expoTokenRepository: Repository<ExpoToken>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async addTokenToDatabase(createTokenDTO: CreateTokenDTO): Promise<Message> {
    try {
      const { expoToken, userId, userPhoneNumber } = createTokenDTO;
  
      let existingToken = await this.expoTokenRepository.findOne({ where: { userId } });
  
      if (existingToken) {
        existingToken.expoToken = expoToken; // Update the existing token's expoToken
        await this.expoTokenRepository.save(existingToken);
      } else {
        const newExpoToken = this.expoTokenRepository.create({
          expoToken,
          userId,
          phoneNumber: userPhoneNumber,
        });
        await this.expoTokenRepository.save(newExpoToken);
      }
  
      return { message: "Successful", status: Status.SUCCESSFUL };
    } catch (error) {
      return {
        message: "Failed",
        error: error.stack.toString(),
        status: Status.FAILED,
      };
    }
  }   

  async sendNotification(notificationDTO: NotificationDTO): Promise<Message> {
    try {
      const expo = new Expo({ accessToken: 'jzRJ2Ene4iVopezMLbsLsNmoLXLMwjJ7hASuTIPt' });
      const messages = [];
      const expoToken = await this.expoTokenRepository.findOne({
        where: { phoneNumber: notificationDTO.userPhoneNumber },
      });

      if (!expoToken) {
        return {
          message: "Failed: Expo token not found",
          status: Status.FAILED,
        };
      }

      const newNotification = await this.notificationsRepository.save({
        title: notificationDTO.title,
        body: notificationDTO.body,
        expoToken: expoToken.expoToken,
        read: false,
        userId: expoToken.userId,
      });

      messages.push({
        to: expoToken.expoToken,
        sound: "default",
        body: notificationDTO.body,
        title: notificationDTO.title,
      });

      await expo.sendPushNotificationsAsync(messages);

      return { message: "Successful", status: Status.SUCCESSFUL };
    } catch (error) {
      return {
        message: "Failed",
        error: error.stack.toString(),
        status: Status.FAILED,
      };
    }
  }

  async readNotification(readNotificationDTO: ReadNotificationDTO): Promise<Message> {
    try {
      const { notificationId, read } = readNotificationDTO;
  
      let existingNotification = await this.notificationsRepository.findOne({ where: { id: notificationId } });
  
      if (existingNotification) {
        existingNotification.read = read; // Update the existing Notification's read status
        await this.notificationsRepository.save(existingNotification);
      } 
      return { message: "Notification Marked as Read", status: Status.SUCCESSFUL };
    } catch (error) {
      return {
        message: "Failed to mark notification as Read",
        error: error.stack.toString(),
        status: Status.FAILED,
      };
    }
  }

  async revokeNotificationAccess(userPhoneNumber: string): Promise<Message> {
    try {
      const expoToken = await this.expoTokenRepository.findOne({
        where: { phoneNumber: userPhoneNumber },
      });

      if (expoToken) {
        await this.expoTokenRepository.remove(expoToken);
        return { message: "Successful", status: Status.SUCCESSFUL };
      } else {
        return {
          message: "Failed: Expo token not found",
          status: Status.FAILED,
        };
      }
    } catch (e) {
      return { message: "Failed", status: Status.FAILED };
    }
  }

  async deleteNotification(notificationId: string): Promise<Message> {
    try {
      const notification = await this.notificationsRepository.findOne({
        where: { id: notificationId },
      });

      if (notification) {
        await this.notificationsRepository.remove(notification);
        return { message: "Notification deleted Successfully", status: Status.SUCCESSFUL };
      } else {
        return {
          message: "Failed: Notification not found",
          status: Status.FAILED,
        };
      }
    } catch (e) {
      return { message: "Failed", status: Status.FAILED };
    }
  }
}
