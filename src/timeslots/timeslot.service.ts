import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from 'path';

@Injectable()
export class TimeslotService {
  constructor() {}

  private filePath = path.join(__dirname, '../../src/helper/timeslot.json');// Adjust as necessary

getTimeSlotDataFromFile(): any {
    try {
      const jsonData = fs.readFileSync(this.filePath, "utf8");
      return {
        message: "Time Slots fetched successfully",
        data: JSON.parse(jsonData),
      };
    } catch (error) {
      return {
        message: "Error Reading Json File",
        error,
      };
    }
  }
}