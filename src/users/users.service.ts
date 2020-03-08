import { Injectable } from '@nestjs/common';
import { DbConnectionService } from '../dbConnection.service';

@Injectable()
export class UsersService {
  dbConnection;

  constructor(dbConnection: DbConnectionService) {
    this.dbConnection = dbConnection.getConnection();
  }

  async findOne(username: string) {
    //??????
    // return await this.dbConnection.query(`SELECT * FROM employees WHERE name="${username}";`, function (err, result) {
    //   if (err) throw err;
    //   return result;
    // });
    // ??????
    return {user: 'Admin', password: '123'};
  }
}
