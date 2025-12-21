import { useState } from "react";
import api from "../services/api";

function CreatePortfolio() {
  const [title, setTitle] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/portfolio", { title });
    alert("Portfolio created");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md" onSubmit={submit}>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Create Portfolio</h2>
        <input
          placeholder="Portfolio Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreatePortfolio;
