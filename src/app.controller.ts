import { Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/employees")
  getEmployees(@Req() req, @Res() res) {
    return this.appService.getEmployees(req.body.searchValue, req.body.pageNumber, res);
  }

  @Delete(`/employee/:id`)
  deleteEmployee(@Req() req, @Res() res) {
    return this.appService.deleteEmployee(req.params.id, res);
  }
}
