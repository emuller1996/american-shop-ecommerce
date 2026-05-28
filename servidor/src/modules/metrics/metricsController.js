import MetricsService from "./metricsService.js";

class MetricsController {
  async getOrdersStats(req, res) {
    try {
      const stats = await MetricsService.getOrdersStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in getOrdersStats controller:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving order statistics",
        error: error.message,
      });
    }
  }

  async getStatusStats(req, res) {
    try {
      const stats = await MetricsService.getStatusStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error in getStatusStats controller:", error);
      return res.status(500).json({
        success: false,
        message: "Error retrieving status statistics",
        error: error.message,
      });
    }
  }
}

export default new MetricsController();