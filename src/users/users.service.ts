import { Injectable } from '@nestjs/common';
import { DbConnectionService } from '../dbConnection.service';

@Injectable()
export class UsersService {
  dbConnection;

  constructor(dbConnection: DbConnectionService) {
    this.dbConnection = dbConnection.getConnection();
  }

  async findOne(username: string) {
    return {username: 'Admin', password: '123'};
  }
}
