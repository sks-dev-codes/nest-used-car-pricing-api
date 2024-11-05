import {
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Injectable
} from "@nestjs/common";
import { UsersService } from "../users.service";
import { Observable } from "rxjs";

@Injectable()
export class CurrentuserInterceptor implements NestInterceptor {
    constructor(private userService: UsersService) {

    }
    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userID } = request.session || {};

        if (userID) {
            const user = await this.userService.findOne(userID);
            request.currentUser = user;
        }

        return handler.handle();
    }
}