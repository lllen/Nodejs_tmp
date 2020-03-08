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
    this.dbConnection.query(`SELECT emp.id, emp.name as name, active, d.name as department
      FROM employees emp JOIN department d ON emp.department_id = d.id
      WHERE emp.name Like "${searchValue}%" OR d.name Like "${searchValue}%";`, function (err, result) {
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
    this.dbConnection.query(`DELETE FROM employees WHERE id=${id};`, function (err, result) {
      if (err) throw err;
      return res.send({
        status: 200
      });
    });
  }
}
