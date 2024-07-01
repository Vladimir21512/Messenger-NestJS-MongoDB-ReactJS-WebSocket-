import {
  Body,
  Controller,
  Get, HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { Response,Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from "./dto/create-user.dto";
import Path = require('path');
import { randomUUID } from 'crypto';
import { FindUserDto } from "./dto/find-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';

const storage = {
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(new HttpException(`Unsupported file type ${file.originalname}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  storage : diskStorage({
    destination: 'src/images',
    filename: (req, file, cb) =>{
      const filename: string = randomUUID();
      const extension: string = Path.parse(file.originalname).ext;
      return cb(null, `${filename}${extension}`)
    }
  })
}

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('changephoto')
  @UseInterceptors(FileInterceptor('file', storage))
  async changephoto(@Body() userId, @Res() response: Response, @UploadedFile() file: Express.Multer.File){

      const photoName=file.filename
      const ID = userId['userId']
      return await this.userService.changephoto(photoName,ID, response);


  }

  @Post('/create')
  @UseInterceptors(FileInterceptor('file', storage))
  async create(@Body() userDto:CreateUserDto, @Res() response: Response, @UploadedFile() file: Express.Multer.File){

    const salt = 10;
    const password = userDto.password;

    const hash = await bcrypt.hash(password, salt);

    userDto.password=hash;
    if(file){
      userDto.AvatarName=file.filename
    }
    else{
      userDto.AvatarName='none'
    }
    console.log(userDto)
    return await this.userService.create(userDto, response);
  }
  @Post('login')
  async login(@Body() userDto:LoginUserDto, @Res() response: Response){
    return await this.userService.login(userDto, response);
  }

  @Post('check')
  async Check(@Req() request:Request, @Body() accessToken, @Res() response: Response){
    return await this.userService.check(request, accessToken, response);
  }
  @Get('contacts/:id')
  async getContacts(@Param('id') id:string, @Res() response: Response){
    return await this.userService.GetContacts(id,response)
  }
  @Post('add')
  async find(@Body() userDto, @Res() response: Response){
    return await this.userService.addUserToContact(userDto, response);
  }

  @Post('deleteContact')
  async deleteContact(@Body() body, @Res() response: Response){
    return await this.userService.DeleteContact(body,response)
  }
  @Get('refresh')
  async refresh(@Req() request:Request,@Res() response: Response){
    return await this.userService.refresh(request, response);
  }

  @Post('deletephoto')
  async deletephoto(@Body() request:Request,@Res() response: Response){
    return await this.userService.deletephoto(request['userId'],response)
  }

  @Post('findone')
  async findone(@Body() request:Request,@Res() response: Response){
    return await this.userService.findOne(request['userId'],response)
  }
}
