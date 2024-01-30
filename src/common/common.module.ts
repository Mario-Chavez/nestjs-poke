import { AxiosAdapter } from './adapters/axios.adapters';
import { Module } from '@nestjs/common';

@Module({
  providers: [AxiosAdapter],
  exports: [AxiosAdapter],
})
export class CommonModule {}
