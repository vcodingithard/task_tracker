import { useState } from "react";
import HealthForm from "../components/HealthForm";
import HealthChart from "../components/HealthChart";
import ganeshaImage from "../../public/ganesha.png";
import hanumanImage from "../../public/hanuman.png";

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
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        <img src={ganeshaImage} alt="Ganesha" style={{ width: "200px", height: "auto" }} />
        <img src={hanumanImage} alt="Hanuman" style={{ width: "200px", height: "auto" }} />
      </div>
    </div>
  );
};

export default Dashboard;