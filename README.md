# TODO Project

## Backend (Node.js/Express)
- Install dependencies:
  ```
  cd backend && npm install
  ```
- To start:
  ```
  npm start
  ```

## Frontend (React)
- Install dependencies:
  ```
  cd frontend && npm install
  ```
- To start:
  ```
  npm start
  ```

## Python API (FastAPI)
- Install dependencies (recommended in a virtual environment):
  ```
  cd python_api
  python -m venv venv
  source venv/bin/activate  # On Windows use venv\Scripts\activate
  pip install fastapi uvicorn pydantic sqlite3
  ```
- To start:
  ```
  uvicorn app:app --reload --port 8888
  ```

## Important Note

This codebase is intentionally designed with bugs and imperfections to serve as a learning tool. The purpose is to encourage debugging, problem-solving, and critical thinking as part of the workshop exercises. Please keep this in mind while working through the code
