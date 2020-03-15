import { Injectable } from '@nestjs/common';
import { DbConnectionService } from './dbConnection.service';
import * as jwt_decode from 'jwt-decode';

@Injectable()
export class AppService {
  dbConnection;

  constructor(dbConnection: DbConnectionService) {
    this.dbConnection = dbConnection.getConnection();
  }

  async getEmployees({searchValue, pageNumber}, headers, res) {
    let query;
    let username = this.extractToken(headers).username;
    let select = `SELECT emp.id as empId, emp.name as empName, active as empActive, d.name as empDepartment `;
    query = searchValue ?
      `FROM employees emp 
        JOIN department d ON emp.department_id = d.id
        JOIN app_users au ON emp.user_id = au.id
      WHERE emp.name Like "${searchValue}%" AND au.username="${username}"` :
      `FROM employees emp 
        JOIN department d ON emp.department_id = d.id
        JOIN app_users au ON emp.user_id = au.id
      WHERE au.username="${username}"`;
    const amountOfRecords = await this.getAmountOfEmployees(`SELECT COUNT(emp.id) as amount ${query};`);
    this.dbConnection.query(`${select} ${query} Limit 10;`, function (err, result) {
      if (err) throw err;
      return res.send({
        numberOfRecords: amountOfRecords.amount,
        pageNumber: pageNumber,
        data: result
      });
    });
  }

  deleteEmployee(id, res) {
    this.dbConnection.query(`DELETE FROM employees WHERE id=${id};`, function (err, result) {
      if (err) throw err;
      return res.send({
        status: 200
      });
    });
  }

  getEmployee(id, headers, res) {
    let username = this.extractToken(headers).username;
    this.dbConnection.query(`SELECT emp.id, emp.name as name, active, d.name as department
      FROM employees emp 
        JOIN department d ON emp.department_id = d.id
        JOIN app_users au ON emp.user_id = au.id
      WHERE emp.id=${id} AND au.username="${username}";`, function (err, result) {
      if (err) throw err;
      return res.send(result[0]);
    });
  }

  updateEmployee(id, employee, res) {
    this.dbConnection.query(`UPDATE employees SET name="${employee.name}",
    department_id="${employee.departmentId}",
    active=${employee.active} WHERE id=${id};`,
      (err) => {
        if (err) throw err;
        return res.send({id: id});
    });
  }

  async createEmployee(employee, headers, res) {
    let id = await this.getUserId(this.extractToken(headers).username);
    this.dbConnection.query(`INSERT INTO employees (name, department_id, active, user_id)
    VALUES ("${employee.name}", "${employee.departmentId}", ${employee.active}, "${id}");`,
      (err, result) => {
        if(err) throw err;
        return res.send({id: result.insertId});
      });
  }

  getDepartments(res) {
    this.dbConnection.query(`SELECT * FROM department;`, function (err, result) {
        if (err) throw err;
        return res.send(result);
      });
  }

  getAmountOfEmployees(query) {
    return new Promise<any>((resolve, reject) => {
      this.dbConnection.query(query, function (err, result) {
          return err ? reject(err) : resolve(result[0]);
        })
    });
  }

  extractToken (headers) {
    let token;
    if (headers.authorization && headers.authorization.split(' ')[0] === 'Bearer') {
      token = headers.authorization.split(' ')[1];
      return jwt_decode(token);
    }
    return null;
  }

  getUserId (username) {
    return new Promise<any>((resolve, reject) => {
      this.dbConnection.query(`SELECT id FROM app_users
                               WHERE username="${username}";`,
        function (err, result) {
          return err ? reject(err) : resolve(result[0].id);
        })
    });
  }

}
