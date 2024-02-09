import { Module } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';

@Module({
  providers: [ElasticsearchService],
})
export class ElasticsearchModule {
  constructor(private readonly elasticsearchService: ElasticsearchService) {
    this.elasticsearchService.checkConnection().then((isConnected) => {
      if (!isConnected) {
        console.error('Failed to connect to Elasticsearch');
      }
    });
  }
}
