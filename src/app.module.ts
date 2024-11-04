import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { RedirectModule } from './modules/redirect/redirect.module';
import { UrlsModule } from './modules/urls/urls.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    UrlsModule,
    RedirectModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
