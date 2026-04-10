import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const HealthChart = ({ data }) => {
  const chartData = {
    labels: ["Sleep", "Appetite", "Stress", "Activity"],
    datasets: [
      {
        data: [data.sleep, data.appetite, data.stress, data.activity],
      },
    ],
  };

  return (
    <div style={{ width: "300px" }}>
      <Pie data={chartData} />
    </div>
  );
};

export default HealthChart;