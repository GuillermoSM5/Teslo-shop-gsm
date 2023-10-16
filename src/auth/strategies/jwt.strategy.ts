import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interface/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService:ConfigService       
        ){
        super({
            secretOrKey:configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }


    async validate( paylod: JwtPayload ):Promise<User>{
        
        const { email } = paylod;

        const user = await this.userRepository.findOneBy({email});

        if(!user){
            throw new UnauthorizedException('Token not valid')
        }

        if(!user.isActive){
            throw new UnauthorizedException("User is inactive, talk with an admin");
        }

        return user
    }
}