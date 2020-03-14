import { Injectable } from '@nestjs/common';
import { DbConnectionService } from '../dbConnection.service';


@Injectable()
export class UsersService {
  dbConnection;

  constructor(dbConnection: DbConnectionService) {
    this.dbConnection = dbConnection.getConnection();
  }

   async findOne(username: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.dbConnection.query(`SELECT username, password FROM app_users
                               WHERE username="${username}";`,
        function (err, result) {
          return err ? reject(err) : resolve(result[0]);
        })
    });
  }
}
