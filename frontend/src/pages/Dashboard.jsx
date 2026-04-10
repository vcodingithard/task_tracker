import { useState } from "react";
import HealthForm from "../components/HealthForm";
import HealthChart from "../components/HealthChart";

const Dashboard = () => {
  const [result, setResult] = useState(null);

  return (
    <div>
      <h1>Dashboard</h1>

      <HealthForm setResult={setResult} />

      {result && (
        <div>
          <h2>Result</h2>
          <p><b>Score:</b> {result.score}</p>
          <p><b>Recommendation:</b> {result.recommendation}</p>

          <HealthChart data={result} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;