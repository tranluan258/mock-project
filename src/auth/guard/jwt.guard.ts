import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../account/enum/role.enum';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private role: Role) {
    super();
    this.role = role;
  }

  public resource: string;
  public action: string;
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    this.resource = request.path?.split('/')[1];
    this.action = request.method.toLocaleLowerCase();
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    if (user.role == Role.Admin) return user;

    if (user.role != this.role) throw new ForbiddenException('No role');

    const permission = user.permission;
    const check = permission?.[this.resource]?.includes(this.action);
    if (!check) {
      throw new ForbiddenException('No permission');
    }
    return user;
  }
}
