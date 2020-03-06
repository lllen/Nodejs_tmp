import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello() {
  //   return this.appService.getHello();
  // }

  @Get()
  getCategories() {
    return this.appService.getCategories();
  }
}
