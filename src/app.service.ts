import { Injectable, Res } from '@nestjs/common';
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

  getEmployees(searchValue, pageNumber, res) {
    let fromElement = (pageNumber-1)*10;
    this.connection.query(`SELECT au.id, au.name as name, active, d.name as department
      FROM app_user au JOIN department d ON au.department_id = d.id
      WHERE au.name Like "${searchValue}%" OR d.name Like "${searchValue}%";`, function (err, result) {
      if (err) throw err;
      return res.send({
        numberOfRecords: result.length,
        pageNumber: pageNumber,
        data: result.splice(fromElement, 10).map(el => ({
          ...el,
          active: el.active ? 'yes' : 'no'
        })), //todo: do check
      });
    });
  }

  deleteEmployee(id, res) {
    this.connection.query(`DELETE FROM app_user WHERE id=${id};`, function (err, result) {
      if (err) throw err;
      return res.send({
        status: 200
      });
    });
  }
}
