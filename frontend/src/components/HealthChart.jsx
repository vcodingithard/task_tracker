import { useState } from "react";
import API from "../api/axios";

const HealthForm = ({ setResult }) => {
  const [form, setForm] = useState({
    sleep: 3,
    appetite: 3,
    stress: 3,
    activity: 3
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await API.post("/health", form);
    setResult(res.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Health Form</h2>

      {["sleep", "appetite", "stress", "activity"].map((field) => (
        <div key={field}>
          <label>{field}</label>
          <input
            type="number"
            name={field}
            min="1"
            max="5"
            value={form[field]}
            onChange={handleChange}
          />
        </div>
      ))}

      <button type="submit">Submit</button>
    </form>
  );
};

export default HealthForm;