import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { response } from 'express';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
              private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    await this.usersService.findOne(username)
      .then(user => {
        console.log(user);
        if (user.username == username) {
          return user;
        }
        return null;
      });
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
