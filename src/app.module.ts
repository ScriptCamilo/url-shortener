import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';

@Module({
  imports: [EnvConfigModule.forRoot(), UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
