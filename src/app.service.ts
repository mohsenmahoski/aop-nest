import { Injectable } from '@nestjs/common';
import { delay } from './utils';
import { IServerResponse } from './interface';
import { LogExecutionTimeOfClass } from './interceptor/logExecutionTime';

@Injectable()
@LogExecutionTimeOfClass()
export class AppService {
  async serviceOne(): Promise<IServerResponse> {
    await delay(1000);
    return {
      message: 'response from service one',
    };
  }

  async serviceTwo(): Promise<IServerResponse> {
    await delay(2000);
    return {
      message: 'response from service two',
    };
  }

  async serviceThree(): Promise<IServerResponse> {
    await delay(3000);
    return {
      message: 'response from service three',
    };
  }

  async serviceFour(): Promise<IServerResponse> {
    await delay(4000);
    return {
      message: 'response from service four',
    };
  }
}
