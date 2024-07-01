import { Injectable, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import {User} from './user.schema';
import {CreateUserDto} from './dto/create-user.dto';
import { Model } from 'mongoose';
import { FindUserDto } from "./dto/find-user.dto";
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from "./dto/login-user.dto";
import { stringify } from "ts-jest";
import {TokenService} from "./token.service";
import { filter } from "rxjs";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>, private readonly tokenService:TokenService){}

  ////////////////////
  // С ТОКЕНОМ
  async DeleteContact(body,response){
    const user=await this.userModel.findOneAndUpdate({_id:body['owner_id']},{$pull:{'contacts':{userId:body['contactId']}}})
    return response.send(body['contactId'])
  }
  async addUserToContact(userDto, response:Response){
    const checkUser = await this.userModel.find({email:userDto.nickname}).lean()
    if(checkUser.length!=0) {
      const user = checkUser[0]
      const own = await this.tokenService.VerifyAccessToken(userDto.owner)
      if(own!=false) {
        const ID = own['user']['_id']
        const check_contact = await this.userModel.findOne({ _id: ID })

        let bool = false
        const cont = check_contact['contacts']

        cont.forEach(cycle => {
          if (cycle['userId'] == String(user['_id'])) {
            bool = true
          }
        })

        if (!bool) {
          const update_contacts = await this.userModel.findOneAndUpdate({ _id: ID }, {
            $push: {
              'contacts': {
                name: userDto.name,
                userId: user['_id']
              }
            }
          }, { new: true })

          delete checkUser['password']
          delete checkUser['chats']
          delete checkUser['contacts']
          delete checkUser['refreshtoken']
          checkUser['status']=checkUser['LastVisit']
          delete checkUser['LastVisit']
          checkUser['userId']=checkUser['_id']
          delete checkUser['_id']
          checkUser['name']=userDto.name
          return response.send(checkUser)
          // update_contacts.then(u => {
          //   console.log(u)
          //   if(typeof(u)=='object'){
          //     console.log(Object.keys(u))
          //   }
          //   return response.send(u['_doc'])
          // })

        } else {
          return response.send({ 'message': 'user is already in contacts' })
        }
      }
      else{
        return response.json({'message':'invalid token'})
      }
    }
    else{
      const checkUserAgain = await this.userModel.find({nickname:userDto.nickname}).lean()
      if(checkUserAgain.length!=0) {
        const user = checkUserAgain[0]
        const own = await this.tokenService.VerifyAccessToken(userDto.owner)
        if(own!=false) {
          const ID = own['user']['_id']
          const check_contact = await this.userModel.findOne({ _id: ID })
          const cont = check_contact['contacts']
          let bool = false
          cont.forEach(cycle=> {
            if(cycle['userId']==String(user['_id'])){
              bool=true
            }
          })

          if(!bool) {
            const update_contacts = await this.userModel.findOneAndUpdate({_id:ID},{$push:{'contacts':{name:userDto.name, userId:user['_id']}}}, { new: true })

            delete user['password']
            delete user['chats']
            delete user['contacts']
            delete user['refreshtoken']
            user['status']=user['LastVisit']
            delete user['LastVisit']
            user['userId']=user['_id']
            delete user['_id']
            user['name']=userDto.name
            return response.send(user)
            // update_contacts.then(l=> {
            //
            //   console.log(l)
            //   if(typeof(l)=='object'){
            //     console.log(Object.keys(l))
            //   }
            //   return response.send(l['_doc'])
            // })
          }
          else{
            return response.send({'message':'user is already in contacts'})
          }

        }
        else{
          return response.json({'message':'invalid token'})
        }
      }
      else{
        return response.json({'message':'no users found'})
      }
    }
  }
  async GetContacts(id, response:Response){
    const ID = await this.tokenService.VerifyAccessToken(id)
    if(ID) {
      const find_user = await this.userModel.findOne({ _id: ID['user']['_id'] })
      let new_contacts=[]

      for (let i = 0; i < find_user['contacts'].length; i++) {
        const cont = find_user['contacts'][i]
        const contactUser=await this.userModel.findOne({_id:cont['userId']})
        let item={}
        item['name']=cont['name']
        item['userId']=cont['userId']
        item['AvatarName']=contactUser['AvatarName']
        new_contacts.push(item)

        if(i+1==find_user['contacts'].length){
          return response.send(new_contacts)
        }
      }

    }
    else{
      return response.json({'message':'invalid token'})
    }
  }
  async check(request:Request,accessToken, response:Response){
    const token = accessToken['accessToken']
    const check_token = await this.tokenService.VerifyAccessToken(token)
    delete check_token['iat']
    delete check_token['exp']
    return response.send(check_token);
  }

  ////////////////////
  ////////////////////
  //БЕЗ ТОКЕНА
  async login(userDto:LoginUserDto, response: Response){
    const find_user = await this.userModel.find({email:userDto.email}).lean();
    if(find_user.length==0){
      return response.json({"message":"User with this email is not find"})
    }
    const pass = userDto.password
    const check_pass = await bcrypt.compare(pass, find_user[0].password)
    if(!check_pass){
      return response.json({'message':'Password is invalid'})
    }
    console.log('next')
    delete find_user[0]['password']
    delete find_user[0]['refreshtoken']
    delete find_user[0]['contacts']
    delete find_user[0]['__v']
    const tokens = await this.tokenService.generateJwtTokens({...find_user[0]})
    const update_user=await this.userModel.updateOne({email:userDto.email}, {$set:{refreshtoken:tokens['refreshToken']}})

    response.cookie('refreshToken', tokens['refreshToken'], {maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true, secure:false})
    return response.json({user:find_user, accessToken:tokens['accessToken']})
    // find_user.then((a)=>{
    //   if(a.length==0){
    //     response.json({"message":"User with this email is not find"})
    //   }
    //   else{
    //     const pass = userDto.password
    //     const check_pass = bcrypt.compare(pass, a[0].password).then(e=> {
    //       if(e){
    //         delete a[0]['refreshtoken']
    //         delete a[0]['__v']
    //         delete a[0]['password']
    //         delete a[0]['contacts']
    //         console.log(a[0])
    //         const tokens = this.tokenService.generateJwtTokens({...a[0]})
    //         tokens.then(th=>{
    //
    //           console.log(th)
    //         })
    //         response.json({'message':'You are succesfully log in!'})
    //       }
    //       else{
    //         response.json({'message':'Password is invalid'})
    //       }
    //     })
    //   }
    // })


  }
  async create(userDto:CreateUserDto, response: Response){

    const checkUser = await this.findUser(userDto)
    if(checkUser.length!=0){
      return response.json({'message':'This email is already using on Serice'})
    }
    else {
      const createUser = new this.userModel(userDto)
      const obj={name:userDto.name, email:userDto.email, nickname:userDto.nickname, _id:createUser['_id'], AvatarName:userDto.AvatarName}

      //СОЗДАЁМ ПОЛЬЗОВАТЕЛЯ В БД, ГЕНЕРИРУЕМ Access И Refresh ТОКЕНЫ, Refresh СОХРАНЯЕМ В ЗАПИСИ ПОЛЬЗОВАТЕЛЯ
      //В БД И ОТПРАВЛЯЕМ В КУКАХ, Access ЗАСОВЫВАЕМ В ОТВЕТ СЕРВЕРА, ЧТОБЫ НА КЛИЕНТЕ ПОМЕСТИТЬ ЕГО В LocalStorage
      const tokens = this.tokenService.generateJwtTokens({...obj})
      tokens.then(al=>{
        userDto['refreshtoken']=al['refreshToken']
        createUser['refreshtoken'] =al['refreshToken']
        createUser.save()
        delete userDto['password']
        const res_obj={
          ...userDto,
          accessToken:al['accessToken']
        }
        response.cookie('refreshToken',al['refreshToken'],{maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false})
        return response.send(res_obj)
      })
    }
  }
  async refresh(req:Request, response:Response){

    const refreshToken = req.cookies['refreshToken'];

    const userData = await this.tokenService.VerifyRefreshToken(refreshToken)
    if(userData==false){
      return response.json({'message':'invalid token'})
    }
    else{
      const findUser = await this.userModel.findOne({refreshtoken:refreshToken}).lean()

      if(findUser!=null){
        delete findUser['password']
        delete findUser['refreshtoken']
        delete findUser['contacts']
        delete findUser['__v']

        const obj = findUser

        const tokens = await this.tokenService.generateJwtTokens(obj)
        const update_user = await this.userModel.updateOne({refreshtoken:refreshToken},{$set:{refreshtoken:tokens['refreshToken']}})

        response.cookie('refreshToken', tokens['refreshToken'], {maxAge: 15 * 24 * 60 * 60 * 1000, httpOnly: true, secure:false})

        return response.json({ user: obj, accessToken: tokens['accessToken'] })
      }
      else{
        return response.json({'message':'invalid token'})
      }
    }
  }
  async findUser(userDto:FindUserDto):Promise<User[]>{
    const find_user = this.userModel.find({email:userDto.email});
    return find_user;
  }

  async findOne(userId,response){
    const user = await this.userModel.findOne({_id:userId}).lean()
    delete user.password
    delete user.chats
    delete user.contacts
    delete user.refreshtoken
    return response.send(user)
  }
  async changephoto(photoName, userId, response){
    const user = await this.userModel.updateOne({_id:userId},{$set:{AvatarName:photoName}})
    response.send(user['AvatarName'])
    return user['AvatarName']
  }
  async deletephoto(userId,response){

    const user = await this.userModel.updateOne({_id:userId},{AvatarName:'none'})
    return response.send('ok')
  }
}
