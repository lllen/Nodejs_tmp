import { Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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

  @Post("/employees")
  getEmployees(@Req() req, @Res() res) {
    return this.appService.getEmployees(req.body.searchValue, req.body.pageNumber, res);
  }

  @Delete(`/employee/:id`)
  deleteEmployee(@Req() req, @Res() res) {
    return this.appService.deleteEmployee(req.params.id, res);
  }
}
