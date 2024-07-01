import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './create-message.dto';
// import { UpdateMessageDto } from './update-message.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Message } from "./message_schema";
import {User} from "../user/user.schema";
import { Model } from "mongoose";
import {TokenService} from "./token.service";

@Injectable()
export class MessageService {
  constructor(@InjectModel(Message.name) private messageModel: Model<Message>,@InjectModel(User.name) private userModel: Model<User>, private readonly tokenService:TokenService) {}
  create(createMessageDto: CreateMessageDto) {
    const new_mess = new this.messageModel(createMessageDto)
    return new_mess.save();
  }
  async online(token){
    const accessToken = await this.tokenService.VerifyAccessToken(token['token'])
    if(accessToken) {
      const ID = String(accessToken['user']['_id'])
      const user = await this.userModel.updateOne({_id:ID},{$set:{LastVisit:'online'}})
    }
    else{
      return 'invalid token'
    }
  }

  async offline(token){
    const accessToken = await this.tokenService.VerifyAccessToken(token['token'])
    if(accessToken) {
      const ID = String(accessToken['user']['_id'])
      const date = new Date()
      const user = await this.userModel.updateOne({_id:ID},{$set:{LastVisit:date}})
    }
    else{
      return 'invalid token'
    }
  }

  async offline_test(id){
    const date = new Date()
    if(id!='') {
      const user = await this.userModel.updateOne({ _id: id }, { $set: { LastVisit: date } })
      const find_user =  await this.userModel.findOne({ _id: id })
      return find_user
    }
    else{
      return 'invalid'
    }
  }
  async get_user_status(id){
    const user = await this.userModel.findOne({_id:id})
    return user
  }

  async search(mess){
    const user = await this.userModel.find({nickname:{$regex:mess['name']}}).lean()

    if(!user){
       const user_one = await this.userModel.find({email:mess['name']}).lean()
      if(!user_one){
        return null
      }
      else{
        return user_one
      }
    }
    else{
      return user
    }
  }
  // findAll() {
  //   return `This action returns all message`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} message`;
  // }
  //
  // update(id: number, updateMessageDto: UpdateMessageDto) {
  //   return `This action updates a #${id} message`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} message`;
  // }
}
