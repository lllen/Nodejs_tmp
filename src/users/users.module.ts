import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DbConnectionService } from '../dbConnection.service';

@Module({
  exports: [UsersService],
  providers: [UsersService, DbConnectionService]
})
export class UsersModule {}
