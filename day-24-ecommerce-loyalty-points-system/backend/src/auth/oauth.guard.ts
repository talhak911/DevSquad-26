import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { callbackUrl } = request.query;
    if (callbackUrl) {
      request.session.callbackUrl = callbackUrl;
    }
    return super.canActivate(context) as boolean;
  }
}

@Injectable()
export class GithubOAuthGuard extends AuthGuard('github') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { callbackUrl } = request.query;
    if (callbackUrl) {
      request.session.callbackUrl = callbackUrl;
    }
    return super.canActivate(context) as boolean;
  }
}

@Injectable()
export class DiscordOAuthGuard extends AuthGuard('discord') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { callbackUrl } = request.query;
    if (callbackUrl) {
      request.session.callbackUrl = callbackUrl;
    }
    return super.canActivate(context) as boolean;
  }
}
