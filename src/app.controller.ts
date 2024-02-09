import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/first')
  async firstMethod() {
    await this.appService.serviceOne();
    return {
      message: 'response of first method',
    };
  }

  @Get('/second')
  async secondMethod() {
    await this.appService.serviceOne();
    await this.appService.serviceTwo();
    return {
      message: 'response of second method',
    };
  }

  @Get('/third')
  async thirdMethod() {
    await this.appService.serviceOne();
    await this.appService.serviceTwo();
    await this.appService.serviceThree();
    return {
      message: 'response of third method',
    };
  }

  @Get('/fourth')
  async fourthMethod() {
    await this.appService.serviceOne();
    await this.appService.serviceTwo();
    await this.appService.serviceThree();
    await this.appService.serviceFour();
    return {
      message: 'response of fourth method',
    };
  }
}
