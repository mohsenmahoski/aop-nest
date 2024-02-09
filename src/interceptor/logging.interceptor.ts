import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private elasticsearchService: ElasticsearchService;

  constructor(private moduleRef: ModuleRef) {}

  async elasticLogger(documentBody: any) {
    try {
      const indexName = 'app-performance'; // Specify the index name
      const documentId = undefined; // Let Elasticsearch generate an ID

      await this.elasticsearchService.insertDocument(
        indexName,
        documentBody,
        documentId,
      );
      console.log('Successfully sending data to Elasticsearch', documentBody);
    } catch (error) {
      console.error('Unable to send logs to Elasticsearch', error.message);
    }
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Lazily load the ElasticsearchService to avoid a circular dependency
    if (!this.elasticsearchService) {
      this.elasticsearchService = this.moduleRef.get(ElasticsearchService, {
        strict: false,
      });
    }

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        const documentBody = {
          delay,
          method: context.getHandler().name,
          className: context.getClass().name,
        }; // The document to index, taken from request body;

        this.elasticLogger(documentBody); // Don't use await to avoid more delay time in each request
      }),
    );
  }
}
