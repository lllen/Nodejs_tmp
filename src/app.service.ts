import { Injectable } from '@nestjs/common';
import { response } from 'express';
const mysql = require('mysql');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Root11@$',
  database: 'lit_store'
};

@Injectable()
export class AppService {
  connection;

  constructor() {
    this.connection = mysql.createConnection(dbConfig);
    this.connection.connect((err) => {
      if (err) throw err;
      console.log('Connected!');
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  getCategories() {
    // return 'Hello World2!';
    return response.send(this.connection.query('SELECT * FROM categories', function (err, result) {
      if (err) throw err;
      return result.map(el => el.name);
    }));
  }
}
