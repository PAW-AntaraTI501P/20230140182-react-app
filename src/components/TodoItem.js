// src/components/TodoItem.js

import React, { useState } from "react";

const TodoItem = ({ todo, onToggleCompleted, onDeleteTodo, isEditing, onSetEditingTodoId, onUpdateTodo }) => {
  const [editText, setEditText] = useState(todo.task);

  const handleSave = () => {
    if (editText.trim()) {
      onUpdateTodo(todo.id, editText);
    }
  };

  const handleCancel = () => {
    onSetEditingTodoId(null);
    setEditText(todo.task); 
  };

  return (
    <li
      style={{
        marginBottom: "10px",
        border: "1px solid white",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: todo.completed ? "#2d3d3d" : "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {isEditing ? (
        // TAMPILAN MODE EDIT
        <div style={{ width: "100%" }}>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ 
              width: "calc(100% - 120px)", 
              padding: "8px", 
              marginRight: "10px",
              borderRadius: "4px",
              border: "1px solid #61dafb"
            }}
          />
          <button onClick={handleSave} style={{ marginRight: "5px", padding: "8px", cursor: "pointer", backgroundColor: "lightgreen" }}>Simpan</button>
          <button onClick={handleCancel} style={{ padding: "8px", cursor: "pointer" }}>Batal</button>
        </div>
      ) : (
        // TAMPILAN NORMAL
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <h3
            style={{
              margin: 0,
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            {todo.task}
          </h3>
          <div style={{ display: "flex", gap: "5px" }}>
            <button
              onClick={() => onSetEditingTodoId(todo.id)} // Tombol baru untuk masuk mode edit
              style={{
                padding: "5px 10px",
                borderRadius: "4px",
                backgroundColor: "lightblue",
                color: "#282c34",
                border: "none",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onToggleCompleted(todo.id, todo.completed)}
              style={{
                padding: "5px 10px",
                borderRadius: "4px",
                backgroundColor: todo.completed ? "salmon" : "lightgreen",
                color: "#282c34",
                border: "none",
                cursor: "pointer",
              }}
            >
              {todo.completed ? "Belum Selesai" : "Selesai"}
            </button>
            <button
              onClick={() => onDeleteTodo(todo.id)}
              style={{
                padding: "5px 10px",
                borderRadius: "4px",
                backgroundColor: "tomato",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              Hapus
            </button>
          </div>
        </div>
      )}
    </li>
  );
};


export default TodoItem;