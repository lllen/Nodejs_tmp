import { Injectable } from '@nestjs/common';
import { DbConnectionService } from '../dbConnection.service';
const bcrypt = require('bcrypt');
const saltRounds = 10;


@Injectable()
export class UsersService {
  dbConnection;

  constructor(dbConnection: DbConnectionService) {
    this.dbConnection = dbConnection.getConnection();
  }

   async findOne(username: string): Promise<any> {
    // this.getHashedPass(pass).then(data => console.log(data));

    return this.dbConnection.query(`SELECT * FROM app_users WHERE username="${username}";`,
      function (err, result) {
        if (err) throw err;
        return result[0];
      });

  }
  //
  // async getHashedPass(pass) {
  //   return bcrypt.hash(pass, saltRounds, (err, hash) => {
  //     return hash;
  //   });
  // }
}
