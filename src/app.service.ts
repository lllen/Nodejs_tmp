import { Injectable } from '@nestjs/common';
import { DbConnectionService } from './dbConnection.service';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


@Injectable()
export class AppService {
  dbConnection;

  constructor(dbConnection: DbConnectionService) {
    this.dbConnection = dbConnection.getConnection();
    this.enableCors();
  }

  async enableCors() {
    // const app = await NestFactory.create(AppModule);
    // app.enableCors();
    // await app.listen(3000);
  }

  getEmployees(searchValue, pageNumber, res) {
    let fromElement = (pageNumber-1)*10;
    let query;
    searchValue ?
      (query = `SELECT emp.id as empId, emp.name as empName, active as empActive, d.name as empDepartment
      FROM employees emp JOIN department d ON emp.department_id = d.id
      WHERE emp.name Like "${searchValue}%";`) :
      (query = `SELECT emp.id as empId, emp.name as empName, active as empActive, d.name as empDepartment
      FROM employees emp JOIN department d ON emp.department_id = d.id;`);
    this.dbConnection.query(query, function (err, result) {
      if (err) throw err;
      return res.send({
        numberOfRecords: result.length,
        pageNumber: pageNumber,
        data: result.length > 10 ?
          result.splice(fromElement, 10).map(el => ({
            ...el,
            active: el.active ? 'yes' : 'no'
        })) : result
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

  getEmployee(id, res) {
    this.dbConnection.query(`SELECT emp.id, emp.name as name, active, d.name as department
      FROM employees emp JOIN department d ON emp.department_id = d.id
      WHERE emp.id=${id};`, function (err, result) {
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
        this.dbConnection.query(`SELECT * FROM employees WHERE
         id = ${id};`,
          function (err, result) {
            if (err) throw err;
            return res.send(result[0]);
          });
    });
  }

  createEmployee(employee, res) {
    this.dbConnection.query(`INSERT INTO employees (name, department_id, active, user_id)
    VALUES ("${employee.name}", "${employee.departmentId}", ${employee.active}, "${employee.userId}");`,
      (err, result) => {
        if(err) throw err;
        console.log(result.insertId);
        this.dbConnection.query(`SELECT * FROM employees WHERE
         name = "${employee.name}" AND department_id = "${employee.departmentId}"
          AND active = ${employee.active};`,
          function (err, result) {
            if (err) throw err;
            return res.send(result[0]);
          });
      });
  }

  getDepartments(res) {
    this.dbConnection.query(`SELECT * FROM department;`, function (err, result) {
        if (err) throw err;
        return res.send(result);
      });
  }

}
