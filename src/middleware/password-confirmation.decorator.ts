import { createParamDecorator } from '@nestjs/common';
import { PasswordConfirmationPipe } from './password-confirmation.pipe';

export const PasswordConfirmation = createParamDecorator(
  (_, ctx) => {
    return new PasswordConfirmationPipe().transform(ctx.switchToHttp().getRequest().body, ctx);
  },
);
