import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      cloud: {
        id: '', // Your cloud id
      },
      auth: {
        apiKey: '', // Your secretToken
      },
      // Optionally, if using username and password instead of apiKey
      // auth: {
      //   username: 'your_username',
      //   password: 'your_password',
      // },
    }); // Adjust the URL to your Elasticsearch instance
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.client.ping();
      console.log('Successfully connected to Elasticsearch');
      return true;
    } catch (error) {
      console.error('Unable to connect to Elasticsearch', error.message);
      return false;
    }
  }

  async insertDocument(
    index: string,
    document: any,
    id?: string,
  ): Promise<any> {
    try {
      const response = await this.client.index({
        index,
        body: document,
        id, // This is optional. If not provided, Elasticsearch generates an ID.
        refresh: 'wait_for', // Ensures the document is searchable immediately after indexing.
      });
      return response;
    } catch (error) {
      console.error(
        'Error inserting document into Elasticsearch',
        error.message,
      );
      throw error; // Rethrow the error or handle it as needed
    }
  }

  //   async search(index: string, query: any) {
  //     const { body } = await this.client.search({
  //       index,
  //       body: query,
  //     });
  //     return body.hits.hits;
  //   }
}
