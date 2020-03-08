import { Injectable } from '@nestjs/common';
const mysql = require('mysql');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Root11@$',
  database: 'lit_store'
};

@Injectable()
export class DbConnectionService {
  connection;

  constructor() {
    this.connection = mysql.createConnection(dbConfig);
    this.connection.connect((err) => {
      if (err) throw err;
      console.log('Connected!');
    });
  }

  getConnection() {
    return this.connection;
  }
}
