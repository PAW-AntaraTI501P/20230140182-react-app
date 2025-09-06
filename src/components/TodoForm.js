// src/components/TodoForm.js

import React, { useState, useEffect } from "react";

const TodoForm = ({ onAddTodo, editTodo }) => {
  const [task, setTask] = useState("");

  useEffect(() => {
    if (editTodo) {
      setTask(editTodo.task); // isi input dengan task yg mau diedit
    } else {
      setTask("");
    }
  }, [editTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() === "") return;
    onAddTodo(task);
    setTask("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ marginBottom: "20px", textAlign: "center" }}
    >
      <h2>{editTodo ? "Edit Todo" : "Tambah Todo Baru"}</h2>
      <input
        type="text"
        placeholder="Tambahkan tugas baru..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        style={{
          padding: "10px",
          width: "60%",
          marginRight: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: editTodo ? "#2196F3" : "#87CEEB",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {editTodo ? "Update" : "Tambah"}
      </button>
    </form>
  );
};

export default TodoForm;