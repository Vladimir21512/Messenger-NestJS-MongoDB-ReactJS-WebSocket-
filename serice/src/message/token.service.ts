import {Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import * as process from "process";
import {User} from '../user/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class TokenService{
  constructor(private readonly jwtService:JwtService, @InjectModel(User.name) private userModel: Model<User>){}
  async generateJwtTokens(user){

    const payload = {user}
    const accessToken= this.jwtService.sign(payload,{
      secret:`${process.env.JWT_ACCES_SECRET}`,
      expiresIn:`${process.env.EXPIRE_ACCESS}`
    })
    const refreshToken= this.jwtService.sign(payload,{
      secret:`${process.env.JWT_REFRESH_SECRET}`,
      expiresIn:`${process.env.EXPIRE_REFRESH}`
    })
    return {accessToken, refreshToken}
  }

  async VerifyRefreshToken(refreshToken){
    try {
      const userData = this.jwtService.verify(refreshToken, { secret: `${process.env.JWT_REFRESH_SECRET}` })
      return userData
    }
    catch (e) {
      return false;
    }

  }

  async VerifyAccessToken(accessToken){
    try {
      const userData = this.jwtService.verify(accessToken, { secret: `${process.env.JWT_ACCES_SECRET}` })
      return userData
    }
    catch (e) {
      return false;
    }

  }

}