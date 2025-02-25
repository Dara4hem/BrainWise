import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardAnalytics: React.FC = () => {
  // Dummy data for demonstration purposes
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Employees Hired",
        data: [2, 5, 3, 7, 4, 6],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Hiring Trend",
      },
    },
  };

  return (
    <Row className="mt-4">
      <Col md={12}>
        <Card className="shadow-lg p-3">
          <Card.Body>
            <h4 className="mb-4">Dashboard Analytics</h4>
            <Line data={data} options={options} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DashboardAnalytics;
