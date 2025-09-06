import React, { useState, useEffect, useCallback } from "react";
import TodoForm from "../../components/TodoForm.js";
import TodoList from "../../components/TodoList.js";
import SearchInput from "../../components/SearchInput.js";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTodo, setEditTodo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);

  const fetchTodos = useCallback((searchQuery) => {
    setLoading(true);
    setNoResults(false);
    const url = searchQuery
      ? `/api/todos?search=${encodeURIComponent(searchQuery)}`
      : "/api/todos";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Pastikan kita mendapatkan array dari response
        const todosData = Array.isArray(data) ? data : (data.todos || []);
        setTodos(todosData);
        setError(null);
        
        // Tampilkan pesan tidak ditemukan hanya jika sedang mencari dan tidak ada hasil
        if (searchQuery && todosData.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setTodos([]);
        setNoResults(searchQuery ? true : false);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchTodos(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm, fetchTodos]);

  const handleAddTodo = (task) => {
    if (editTodo) {
      // mode edit
      fetch(`/api/todos/${editTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((updatedTodo) => {
          setTodos(
            todos.map((todo) =>
              todo.id === editTodo.id
                ? { ...todo, task: updatedTodo.task || task }
                : todo
            )
          );
          setEditTodo(null);
          // Refresh daftar todo setelah edit
          fetchTodos(searchTerm);
        })
        .catch((err) => {
          console.error("Error updating todo:", err);
          setError("Gagal mengupdate todo: " + err.message);
        });
    } else {
      // mode tambah
      fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((newTodo) => {
          setTodos([
            ...todos,
            { 
              id: newTodo.id || Date.now(), 
              task: newTodo.task || task, 
              completed: newTodo.completed || false 
            },
          ]);
          setNoResults(false);
        })
        .catch((err) => {
          console.error("Error adding todo:", err);
          setError("Gagal menambahkan todo: " + err.message);
        });
    }
  };

  const handleDeleteTodo = (id) => {
    fetch(`/api/todos/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setTodos(todos.filter((todo) => todo.id !== id));
        // Jika semua todo dihapus dan sedang dalam mode pencarian, tampilkan pesan tidak ditemukan
        if (searchTerm && todos.length === 1) {
          setNoResults(true);
        }
      })
      .catch((err) => {
        console.error("Error deleting todo:", err);
        setError("Gagal menghapus todo: " + err.message);
      });
  };

  const handleToggleCompleted = (id, completed) => {
    fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !completed }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !completed } : todo
          )
        );
      })
      .catch((err) => {
        console.error("Error updating todo:", err);
        setError("Gagal mengupdate status todo: " + err.message);
      });
  };

  const handleEditTodo = (todo) => {
    setEditTodo(todo);
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <header style={{ textAlign: "center" }}>
        <h1>Aplikasi Todo List</h1>

        <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <TodoForm
          onAddTodo={handleAddTodo}
          editTodo={editTodo}
        />
        
        <h2>Daftar Tugas Anda</h2>
        
        {error && (
          <div style={{ 
            textAlign: "center", 
            color: "red", 
            margin: "10px 0",
            padding: "10px",
            backgroundColor: "#ffe6e6",
            borderRadius: "5px"
          }}>
            Error: {error}
          </div>
        )}
        
        {noResults ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px", 
            color: "#666",
            fontStyle: "italic",
            fontSize: "18px"
          }}>
            Tugas tidak ditemukan
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggleCompleted={handleToggleCompleted}
            onDeleteTodo={handleDeleteTodo}
            onEditTodo={handleEditTodo}
          />
        )}
      </header>
    </div>
  );
};

export default TodoPage;