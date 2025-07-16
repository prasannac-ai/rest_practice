import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8888/todos";
// const API_URL = "http://localhost:3001/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch all todos
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update todo
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      const todo = todos.find((t) => t.id === editingId);
      fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          completed: todo ? (todo.completed ? 1 : 0) : 0,
        }),
      })
        .then((res) => res.json())
        .then((updated) => {
          setTodos((todos) =>
            todos.map((t) => (t.id === updated.id ? updated : t))
          );
          setEditingId(null);
          setForm({ title: "", description: "" });
        });
    } else {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((newTodo) => {
          setTodos((todos) => [...todos, newTodo]);
          setForm({ title: "", description: "" });
        });
    }
  };

  // Edit todo
  const handleEdit = (todo) => {
    setEditingId(todo.id);
    setForm({ title: todo.title, description: todo.description });
  };

  // Delete todo
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setTodos((todos) => todos.filter((t) => t.id !== id)));
  };

  // Toggle completed
  const handleToggle = (todo) => {
    fetch(`${API_URL}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: todo.title,
        description: todo.description,
        completed: todo.completed ? 0 : 1,
      }),
    })
      .then((res) => res.json())
      .then((updated) =>
        setTodos((todos) =>
          todos.map((t) => (t.id === updated.id ? updated : t))
        )
      );
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1>TODO App</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ title: "", description: "" }); }}>
            Cancel
          </button>
        )}
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: 10, background: "#f9f9f9", padding: 10, borderRadius: 4 }}>
            <input
              type="checkbox"
              checked={!!todo.completed}
              onChange={() => handleToggle(todo)}
            />
            <strong style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
              {todo.title}
            </strong>
            <span style={{ marginLeft: 10 }}>{todo.description}</span>
            <button style={{ marginLeft: 10 }} onClick={() => handleEdit(todo)}>
              Edit
            </button>
            <button style={{ marginLeft: 5 }} onClick={() => handleDelete(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
