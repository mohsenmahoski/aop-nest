import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticsearchModule } from './elasticsearch/elasticsearch.module';
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { GlobalRefs } from './global-refs';

@Module({
  imports: [ElasticsearchModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    GlobalRefs.moduleRef = this.moduleRef;
  }
}
