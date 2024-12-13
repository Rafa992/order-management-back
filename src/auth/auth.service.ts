import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import { UserService } from 'src/user/user.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {

    EXPIRE_DAY_REFRESH_TOKEN = 1
    REFRESH_TOKEN_NAME = 'refreshToken'

    constructor(private jwt: JwtService, private userService: UserService){}

    async login(dto:LoginDto){
        const { password, ...user } = await this.validateUser(dto)
        const tokens = this.issueTokens(user.id)
        
        return {
            user,
            ...tokens,
        }
    }

    async register(dto:RegisterDto){
        const oldUser = await this.userService.getByEmail(dto.email)
        if(oldUser) throw new BadRequestException('User already exists')

        const {password, ...user} = await this.userService.create(dto)
        const tokens = this.issueTokens(user.id)

        return {
            user,
            ...tokens,
        }
    }

    async getNewTokens(refreshToken: string){

        const result = await this.jwt.verifyAsync(refreshToken)
        if(!result) throw new UnauthorizedException('Invalid refresh token')

        const {password, ...user} = await this.userService.getById(result.id)

        const tokens = this.issueTokens(user.id)

        return {
            user,
            ...tokens
        }
    }

    private issueTokens(userId: string){
        const data = {id: userId}

        const accessToken = this.jwt.sign(data, {
            expiresIn: '1d'
        })
        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d',
        })
        return {accessToken, refreshToken}
    }

    private async validateUser(dto: LoginDto){
        const user = await this.userService.getByEmail(dto.email)
        if(!user) throw new UnauthorizedException('Incorrect email or password')

        const isValid = await verify(user.password, dto.password)
        if(!isValid) throw new UnauthorizedException('Incorrect email or password')
        return user
    }
}
