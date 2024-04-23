import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Appointment } from "./entities/appointment.entity";
import { RegisterUserDto } from "src/users/dto/register-user.dto";
import { RegisterAppointmentDto } from "./dto/register-appointment.dto";

@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
    ) {}

    async register(registerUserDto: RegisterAppointmentDto) {
        return await this.appointmentRepository.save(registerUserDto);
    }


    async getAllAppointment() {
        const allAppointment = await this.appointmentRepository.find();
    
        if (!allAppointment || allAppointment.length === 0) {
          return {
            message: "No Appointment retrieved",
            data: [],
          };
        }
    
        const formattedAppointment = allAppointment.map((appointment) => {
          return {
            id: appointment.id,
            userId: appointment.userId,
            industryType: appointment.industryType,
            legalIssue: appointment.legalIssue,
            meetingType: appointment.meetingType,
            meetingTime: appointment.meetingTime,
            meetingDate: appointment.meetingDate,
          };
        });
    
        return {
          message: "All Appointments retrieved successfully",
          data: formattedAppointment,
        };
      }

}
