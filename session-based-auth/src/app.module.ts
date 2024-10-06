import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule],
  providers: [],
})
export class AppModule {}
