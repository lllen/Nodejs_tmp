import { Controller, Delete, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService,
              private readonly appService: AppService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post("/employees")
  getEmployees(@Req() req, @Res() res) {
    return this.appService.getEmployees(req.body.searchValue, req.body.pageNumber, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(`/employee/:id`)
  deleteEmployee(@Req() req, @Res() res) {
    return this.appService.deleteEmployee(req.params.id, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get(`/employee/:id`)
  getEmployee(@Req() req, @Res() res) {
    return this.appService.getEmployee(req.params.id, res);
  }

  @UseGuards(JwtAuthGuard)
  @Put(`/employee/:id`)
  updateEmployee(@Req() req, @Res() res) {
    return this.appService.updateEmployee(req.params.id, req.body, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get(`/departments`)
  getDepartments(@Res() res) {
    return this.appService.getDepartments(res);
  }
}
