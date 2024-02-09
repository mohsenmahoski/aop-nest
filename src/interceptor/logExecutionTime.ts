import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';
import { GlobalRefs } from 'src/global-refs';

export function LogExecutionTimeOfMethods() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const start = performance.now();
      const result = await originalMethod.apply(this, args); // Await the result
      const finish = performance.now();
      const delay = finish - start;
      const documentBody = {
        delay,
        method: propertyKey,
        className: this.constructor.name,
      };

      const indexName = 'app-performance'; // Specify the index name
      const documentId = undefined; // Let Elasticsearch generate an ID

      // Dynamically get the ElasticsearchService
      const elasticsearchService = GlobalRefs.moduleRef.get(
        ElasticsearchService,
        { strict: false },
      );

      // Define elasticLogger inside this function to capture the scope
      const elasticLogger = async () => {
        try {
          await elasticsearchService.insertDocument(
            indexName,
            documentBody,
            documentId,
          );
          console.log(
            'Successfully sending data to Elasticsearch',
            documentBody,
          );
        } catch (error) {
          console.error('Unable to send logs to Elasticsearch', error.message);
        }
      };
      elasticLogger();
      return result;
    };

    return descriptor;
  };
}

export const LogExecutionTimeOfClass = () => {
  return function (constructor: any) {
    Object.getOwnPropertyNames(constructor.prototype).forEach((method) => {
      if (method !== 'constructor') {
        const descriptor = Object.getOwnPropertyDescriptor(
          constructor.prototype,
          method,
        );
        if (descriptor && typeof descriptor.value === 'function') {
          Object.defineProperty(
            constructor.prototype,
            method,
            LogExecutionTimeOfMethods()(
              constructor.prototype,
              method,
              descriptor,
            ) || descriptor,
          );
        }
      }
    });
  };
};
