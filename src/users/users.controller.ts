import { Body, Controller, Post, Get, Patch, Param, Query, Delete, NotFoundException, UseGuards, UseInterceptors, ClassSerializerInterceptor, Session } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor'; //for test append befor src ../../
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
//import { CurrentuserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guard'; //for test append befor src ../../

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentuserInterceptor)
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) { }

    // @Get('/whoami')
    // whoAmI(@Session() session: any){
    //     return this.usersService.findOne(session.userID);
    // }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User){
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body.email, body.password);
        session.userID = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userID = user.id;
        return user;
    }

    @Post('/signout')
    async signOut(@Session() session: any) {
        session.userID = null;
    }

    //@UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handller is running');
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('user not found!');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id))
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body);
    }

}
