import { useState } from "react";
import API from "../api/axios";

const HealthForm = ({ setResult }) => {
  const [form, setForm] = useState({
    sleep: 3,
    appetite: 3,
    stress: 3,
    activity: 3,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/health", form);
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >
      <h2 className="text-lg font-bold">Health Form</h2>

      {["sleep", "appetite", "stress", "activity"].map((field) => (
        <div key={field} className="flex flex-col">
          <label className="capitalize text-sm font-medium mb-1">
            {field}
          </label>

          <input
            type="range"
            name={field}
            min="1"
            max="5"
            value={form[field]}
            onChange={handleChange}
          />

          <span className="text-xs text-gray-500">
            Value: {form[field]}
          </span>
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default HealthForm;