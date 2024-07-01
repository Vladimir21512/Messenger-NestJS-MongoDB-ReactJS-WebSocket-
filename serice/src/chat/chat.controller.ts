import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from "@nestjs/common";
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Response } from 'express';
import { ChatInfo } from "./dto/chat-info_dto";



@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Post('getAll')
  findAll(@Body() userId, @Res() response:Response) {
    return this.chatService.findAll(userId, response);
  }
  @Post('add_delete_info')
  add_delete_info(@Body() body, @Res() response:Response) {

    return this.chatService.add_delete_info(body, response);
  }

  @Get("sericechat")
  findOne(@Body() chatInfo: ChatInfo) {
    return this.chatService.findOne(chatInfo);
  }


  @Post('delete/:id')
  delete(@Param('id') id: string){
    return this.chatService.remove(id);
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(+id, updateChatDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.chatService.remove(+id);
  // }
}
