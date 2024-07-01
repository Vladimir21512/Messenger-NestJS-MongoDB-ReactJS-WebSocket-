import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import {Chat, ChatDocument} from './chat.schema';
import { User } from "../user/user.schema";
import {Message} from '../message/message_schema'
import { Model } from "mongoose";
import { Response } from "express";

var fs = require('fs');

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>,@InjectModel(User.name) private userModel: Model<User>,@InjectModel(Message.name) private messageModel: Model<Message>){}
  async create(createChatDto: CreateChatDto) {
    const find_chat=await this.chatModel.findOne({owner_1_id:createChatDto['owner_1_id'],owner_2_id:createChatDto['owner_2_id']})
    const find_chat_1=await this.chatModel.findOne({owner_1_id:createChatDto['owner_2_id'],owner_2_id:createChatDto['owner_1_id']})

    if(find_chat==null && find_chat_1==null){
      const new_chat = await new this.chatModel(createChatDto)
      const user = await this.userModel.updateOne({_id:createChatDto['own_id']},{$push:{chats: { chatId:new_chat["_id"],messageIndex:0 }}})
      let sobes
      if(createChatDto['own_id']==createChatDto['owner_2_id']){
        sobes = createChatDto['owner_1_id']
      }
      else if(createChatDto['own_id']==createChatDto['owner_1_id']){
        sobes = createChatDto['owner_2_id']
      }

      const userSecond = await this.userModel.updateOne({_id:sobes},{$push:{chats: { chatId:new_chat["_id"],messageIndex:0 }}})
      return new_chat.save();
    }
    else{
      return false;
    }
  }

  async findAll(userId, response) {

    if(Object.keys(userId).length!=0) {
      const user = await this.userModel.findOne({ _id: userId.userId }).lean()

      if (user.hasOwnProperty('chats') && user['chats'].length != 0) {

        let contacts_id = {}
        for (let i = 0; i < user['contacts'].length; i++) {
          //contacts_id.push(user['contacts'][i]['userId'])
          contacts_id[user['contacts'][i]['userId']] = user['contacts'][i]['name']
        }
        let new_chats = []

        return new Promise(async (resolve, reject) => {
          if (user.hasOwnProperty('chats')) {

            if (user['chats'].length != 0) {

              for (let i = 0; i < user['chats'].length; i++) {
                const chat = await this.chatModel.findOne({ _id: user['chats'][i]['chatId'] })

                new_chats.push(chat)
              }
              if(new_chats[0]!=null) {
                for (let i = 0; i < new_chats.length; i++) {
                  //АЙДИ СОБЕСЕДНИКА

                  new_chats[i] = new_chats[i]['_doc']

                  let sobes
                  if (user['_id'] == new_chats[i]['owner_1_id']) {
                    sobes = new_chats[i]['owner_2_id']
                  } else if (user['_id'] == new_chats[i]['owner_2_id']) {
                    sobes = new_chats[i]['owner_1_id']
                  }
                  if (Object.keys(contacts_id).includes(sobes)) {
                    let obj = new_chats[i]
                    obj['name'] = contacts_id[sobes]
                    new_chats[i] = obj
                  } else {
                    const user_sobes = await this.userModel.findOne({ _id: sobes })
                    let obj = new_chats[i]
                    obj['name'] = user_sobes['nickname']
                    new_chats[i] = obj
                  }

                  const messages = await this.messageModel.find({ chatId: new_chats[i]['_id'] })
                  if (user['chats'][i]['messageIndex'] == 0) {
                    new_chats[i]['messages'] = messages
                  } else if (messages.length > user['chats'][i]['messageIndex']) {
                    let new_mess = messages
                    new_mess.splice(0, user['chats'][i]['messageIndex'])
                    //const new_messages = messages.slice(0,user['chats'][i]['messageIndex']+1)
                    new_chats[i]['messages'] = new_mess
                  } else {
                    delete new_chats[i]
                  }

                }
              }
            }
          }

          resolve(new_chats)
        }).then((a) => {
          response.send(a)
        })

      }
    }

  }


  async add_delete_info(body,response){
    //const chat = await this.chatModel.find(){_id:body['chatId']}
    const messages = await this.messageModel.find({chatId:body['chatId']}).lean()
    const len = messages.length

    const user_2=await this.userModel.findOne({_id:body['sobesId']})

    let user_1_mess_len=len
    let user_2_mess_len

    for (let i = 0; i < user_2['chats'].length; i++) {
      const iter = user_2['chats'][i]
      if(iter['chatId']==body['chatId']){
        user_2_mess_len=user_2['chats'][i]['messageIndex']
        break;
      }
    }

    const user=await this.userModel.updateOne({_id:body['userId'], 'chats.chatId':body['chatId']},{$set:{"chats.$.messageIndex":len} })


    if(user_1_mess_len==user_2_mess_len){
      const chat = await this.chatModel.deleteOne({_id:body['chatId']})
      const usr_1=await this.userModel.updateOne({_id:body['userId']},{$pull:{chats:{chatId:body['chatId']}}})
      const usr_2=await this.userModel.updateOne({_id:body['sobesId']},{$pull:{chats:{chatId:body['chatId']}}})

      const messages_MAIN = await this.messageModel.find({chatId:body['chatId']}).lean()
      const messages = await this.messageModel.deleteMany({chatId:body['chatId']})

      messages_MAIN.forEach(A=>{

        if(A.hasOwnProperty('filename')){
          fs.rmSync("../serice/src/images/"+A['filename'], {
            force: true,
          });
        }

      })
    }
    else if(user_1_mess_len!=0 && user_2_mess_len!=0){
      let MIN = Math.min(user_1_mess_len,user_2_mess_len)
      let mess_arr=[]
      for (let i = 0; i < MIN; i++) {
        mess_arr.push(messages[i]['_id'])
        if(messages[i].hasOwnProperty('filename')){
          fs.rmSync("../serice/src/images/"+messages[i]['filename'], {
            force: true,
          });
        }
      }
      const delete_messages=await this.messageModel.deleteMany({_id:{$in:mess_arr}})

      //const messages_1 = await this.messageModel.find({chatId:body['chatId']}).lean()
      //const len_1 = messages_1.length
      const user=await this.userModel.updateOne({_id:body['userId'], 'chats.chatId':body['chatId']},{$set:{"chats.$.messageIndex":len-MIN} })
      const user_2 = await this.userModel.updateOne({_id:body['sobesId'], 'chats.chatId':body['chatId']},{$set:{"chats.$.messageIndex":0} })
    }



    return response.send(user);
  }


  async findOne(chatId) {
    const chat = await this.chatModel.find({_id:chatId})
    return chat
  }

  async findOneSecond(owner_1_id,owner_2_id){
    const chat = await this.chatModel.findOne({owner_1_id:owner_1_id, owner_2_id:owner_2_id})
    if(chat==null){
      const chat_1 = await this.chatModel.findOne({owner_1_id:owner_2_id, owner_2_id:owner_1_id})
      return chat_1
    }
    else{
      return chat
    }
  }
  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  async remove(body) {
    // const remove_chat = await this.chatModel.deleteOne({_id:id})
    // return remove_chat
  }

}
