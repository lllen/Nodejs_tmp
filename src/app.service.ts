import { Injectable } from '@nestjs/common';
import { DbConnectionService } from './dbConnection.service';

@Injectable()
export class AppService {
  dbConnection;

  constructor(dbConnection: DbConnectionService) {
    this.dbConnection = dbConnection.getConnection();
  }

  getEmployees(searchValue, pageNumber, res) {
    let fromElement = (pageNumber-1)*10;
    this.dbConnection.query(`SELECT emp.id as empId, emp.name as empName, active as empActive, d.name as empDepartment
      FROM employees emp JOIN department d ON emp.department_id = d.id
      WHERE emp.name Like "${searchValue}%";`, function (err, result) {
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
      function (err, result) {
        if (err) throw err;
        return res.send({
          status: 200
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
