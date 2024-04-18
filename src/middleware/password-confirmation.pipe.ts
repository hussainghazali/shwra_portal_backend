import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class PasswordConfirmationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { password, confirmPassword } = value;

    if (password !== confirmPassword) {
      throw new BadRequestException('Password and confirm password do not match');
    }

    return value;
  }
}
