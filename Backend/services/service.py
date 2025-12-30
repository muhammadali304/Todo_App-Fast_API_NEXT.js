from sqlmodel import select, text
from models.model import Todo
from config.database_connection import get_session

def get_all_todos(session):
    return session.exec(select(Todo)).all()

def get_todo(session, todo_id):
    return session.get(Todo, todo_id)

def create_todo(session, todo: Todo):
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo

def delete_todo(session, todo_id):
    todo = session.get(Todo, todo_id)
    session.delete(todo)
    session.commit()

    # Check if table is now empty and reset sequence if needed
    remaining_todos = session.exec(select(Todo)).all()
    if not remaining_todos:
        # Reset the sequence for the id column in the todo table
        session.exec(text("ALTER SEQUENCE IF EXISTS todo_id_seq RESTART WITH 1"))
        session.commit()

    return todo

def update_todo(session,todo_id,data):
    todo = session.get(Todo,todo_id)
    for key,value in data.items():
        setattr(todo,key,value)
    session.add(todo)
    session.commit()
    session.refresh(todo)
    return todo
