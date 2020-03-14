import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt');
const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,
              private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    const isPasswordsEqual = await this.isPasswordsEqual(password, user.password);
    return (user.username == username && isPasswordsEqual) ? user : null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // for hashing passwords
  async getHashedPass(pass) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(pass, saltRounds, (err, hash) => {
        return err ? reject(err) : resolve(hash);
      })
    });
  }

  async isPasswordsEqual(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, function(err, res) {
        return err ? reject(err) : resolve(res);
      });
    });
  }
}
