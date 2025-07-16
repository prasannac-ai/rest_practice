from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import List, Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "todos.db"


# Pydantic models
class Todo(BaseModel):
    id: Optional[int] = None
    title: str
    description: Optional[str] = None
    completed: int = 0
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None


class TodoUpdate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: int


# Database helper
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            completed INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()


init_db()


# Get all todos
@app.get("/todos", response_model=List[Todo])
def get_todos():
    conn = get_db()
    todos = conn.execute("SELECT * FROM todos").fetchall()
    conn.close()
    return [dict(row) for row in todos]


# Get one todo
@app.get("/todos/{id}", response_model=Todo)
def get_todo(id: int):
    conn = get_db()
    row = conn.execute("SELECT * FROM todos WHERE id = ?", (id,)).fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    return dict(row)


# Create todo
@app.post("/todos", response_model=Todo, status_code=201)
def create_todo(todo: TodoCreate):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO todos (title, description) VALUES (?, ?)",
        (todo.title, todo.description)
    )
    conn.commit()
    last_id = cur.lastrowid
    row = conn.execute(
        "SELECT * FROM todos WHERE id = ?", (last_id,)
    ).fetchone()
    conn.close()
    return dict(row)


# Update todo
@app.put("/todos/{id}", response_model=Todo)
def update_todo(id: int, todo: TodoUpdate):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        """
        UPDATE todos SET title = ?, description = ?, completed = ?, \
        updated_at = CURRENT_TIMESTAMP WHERE id = ?
        """,
        (todo.title, todo.description, 1 if todo.completed else 0, id)
    )
    conn.commit()
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Not found")
    row = conn.execute("SELECT * FROM todos WHERE id = ?", (id,)).fetchone()
    conn.close()
    return dict(row)


# Delete todo
@app.delete("/todos/{id}")
def delete_todo(id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM todos WHERE id = ?", (id,))
    conn.commit()
    if cur.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Not found")
    conn.close()
    return {"success": True}

