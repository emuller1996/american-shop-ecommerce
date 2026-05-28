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
          must: [
            { term: { "type.keyword": "orden" } }
          ],
          must_not: [
            { term: { "status.keyword": "Anulada" } }
          ],
          filter: [
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
      aggs: {
        orders_over_time: {
          date_histogram: {
            field: "createdTime",
            calendar_interval: "day",
            min_doc_count: 0,
          },
          aggs: {
            total_value: {
              sum: {
                field: "total_order",
              },
            },
          },
        },
        total_revenue: {
          sum: {
            field: "total_order",
          },
        },
      },
    };

    try {
      const response = await client.search({
        index: INDEX_ES_MAIN,
        body: query,
      });
      
      const aggregations = response.body.aggregations || response.body.aggs || {};
      const buckets = aggregations.orders_over_time?.buckets || [];
      const totalRevenue = aggregations.total_revenue?.value || 0;
      const totalOrders = response.body.hits?.total?.value || 0;
                      
      return {
        dailyStats: buckets.map(bucket => ({
          date: bucket.key_as_string || new Date(bucket.key).toLocaleDateString('en-CA', { timeZone: 'America/Bogota' }),
          count: bucket.doc_count,
          total: bucket.total_value?.value || 0
        })),
        totals: {
          totalOrders,
          totalRevenue
        }
      };
    } catch (error) {
      console.error("Error fetching metrics from Elasticsearch:", error);
      throw error;
    }
  }

  async getStatusStats() {
    const query = {
      size: 0,
      aggs: {
        orders_by_status: {
          filter: { term: { "type.keyword": "orden" } },
          aggs: {
            statuses: {
              terms: { field: "status.keyword" }
            }
          }
        },
        consultas_by_status: {
          filter: { term: { "type.keyword": "consulta" } },
          aggs: {
            statuses: {
              terms: { field: "status.keyword" }
            }
          }
        }
      }
    };

    try {
      const response = await client.search({
        index: INDEX_ES_MAIN,
        body: query,
      });

      const aggs = response.body.aggregations || response.body.aggs || {};
      
      const ordersStatus = (aggs.orders_by_status?.statuses?.buckets || []).map(b => ({
        name: b.key,
        value: b.doc_count
      }));

      const consultasStatus = (aggs.consultas_by_status?.statuses?.buckets || []).map(b => ({
        name: b.key,
        value: b.doc_count
      }));

      return {
        ordersStatus,
        consultasStatus
      };
    } catch (error) {
      console.error("Error fetching status metrics from Elasticsearch:", error);
      throw error;
    }
  }
}

export default new MetricsService();