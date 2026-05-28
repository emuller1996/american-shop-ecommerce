import { client } from "../../db.js";
import { INDEX_ES_MAIN } from "../../config.js";

class MetricsService {
  async getOrdersStats() {
    // Calculate timestamps for Colombia Time (UTC-5)
    const now = new Date();
    
    // Current time in ms
    const lte = now.getTime();

    // 14 days ago start of day
    const startDate = new Date();
    startDate.setDate(now.getDate() - 14);
    startDate.setHours(0, 0, 0, 0);
    const gte = startDate.getTime();

    const query = {
      size: 0, // We only want aggregation results, not documents
      query: {
        bool: {
          filter: [
            {
              term: { "type.keyword": "orden" }
            },
            {
              range: {
                createdTime: {
                  gte: gte,
                  lte: lte,
                },
              },
            },
          ],
        },
      },
      aggregations: {
        orders_over_time: {
          date_histogram: {
            field: "createdTime",
            calendar_interval: "day",
            min_doc_count: 0,
          },
          aggregations: {
            total_value: {
              sum: {
                field: "total_order",
              },
            },
          },
        },
      },
    };

    try {
      const response = await client.search({
        index: INDEX_ES_MAIN,
        body: query,
      });
      
      const buckets = response.body.aggregations.orders_over_time.buckets;
      console.log(response.body.aggregations.orders_over_time.buckets);
      
      
      return buckets.map(bucket => ({
        date: bucket.key_as_string,
        count: bucket.doc_count,
        total: bucket.total_value.value || 0
      }));
    } catch (error) {
      console.error("Error fetching metrics from Elasticsearch:", error);
      throw error;
    }
  }
}

export default new MetricsService();