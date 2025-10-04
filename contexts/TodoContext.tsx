import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
  addTodo,
  clearAllTodos,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodo,
} from "@/lib/todos";
import { CreateTodoData, Todo, UpdateTodoData } from "@/types/todo";
import React, { createContext, useContext, useEffect, useState } from "react";

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  createTodo: (todoData: CreateTodoData) => Promise<Todo | undefined>;
  updateTodo: (
    id: string,
    updates: UpdateTodoData
  ) => Promise<Todo | undefined>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<Todo | undefined>;
  refetch: () => Promise<void>;
  clearAllTodos: () => Promise<{ deletedCount: number } | undefined>;
  selectAllTodos: () => Promise<void>;
  unselectAllTodos: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { session } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos for the current user
  const fetchTodos = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      setError(null);

      const data = await getTodos(session.user.id);
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  // Create a new todo
  const createTodo = async (todoData: CreateTodoData) => {
    if (!session?.user) return;

    try {
      setError(null);

      const data = await addTodo(session.user.id, todoData.title);
      setTodos((prev) => [data, ...prev]);

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
      throw err;
    }
  };

  // Update a todo
  const updateTodoHandler = async (id: string, updates: UpdateTodoData) => {
    try {
      setError(null);

      let data;
      if (updates.title) {
        data = await updateTodo(id, updates.title);
      } else {
        // For other updates, use direct Supabase call
        const { data: result, error } = await supabase
          .from("todos")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        data = result;
      }

      setTodos((prev) => prev.map((todo) => (todo.id === id ? data : todo)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
      throw err;
    }
  };

  // Delete a todo
  const deleteTodoHandler = async (id: string) => {
    try {
      setError(null);

      await deleteTodo(id);

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
      throw err;
    }
  };

  // Toggle todo completion
  const toggleTodoHandler = async (id: string) => {
    try {
      setError(null);

      const data = await toggleTodo(id);
      setTodos((prev) => prev.map((todo) => (todo.id === id ? data : todo)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle todo");
      throw err;
    }
  };

  // Select all todos (mark all as completed)
  const selectAllTodos = async () => {
    if (!session?.user) return;

    try {
      setError(null);

      // Get all incomplete todos
      const incompleteTodos = todos.filter((todo) => !todo.completed);

      if (incompleteTodos.length === 0) return;

      // Update all incomplete todos to completed using direct Supabase calls
      const { error } = await supabase
        .from("todos")
        .update({
          completed: true,
          updated_at: new Date().toISOString(),
        })
        .in(
          "id",
          incompleteTodos.map((todo) => todo.id)
        );

      if (error) throw error;

      // Update local state
      setTodos((prev) =>
        prev.map((todo) =>
          incompleteTodos.some((incomplete) => incomplete.id === todo.id)
            ? { ...todo, completed: true }
            : todo
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to select all todos"
      );
      throw err;
    }
  };

  // Unselect all todos (mark all completed todos as incomplete)
  const unselectAllTodos = async () => {
    if (!session?.user) return;

    try {
      setError(null);

      // Get all completed todos
      const completedTodos = todos.filter((todo) => todo.completed);

      if (completedTodos.length === 0) return;

      // Update all completed todos to incomplete using direct Supabase calls
      const { error } = await supabase
        .from("todos")
        .update({
          completed: false,
          updated_at: new Date().toISOString(),
        })
        .in(
          "id",
          completedTodos.map((todo) => todo.id)
        );

      if (error) throw error;

      // Update local state
      setTodos((prev) =>
        prev.map((todo) =>
          completedTodos.some((completed) => completed.id === todo.id)
            ? { ...todo, completed: false }
            : todo
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to unselect all todos"
      );
      throw err;
    }
  };

  // Fetch todos when session changes
  useEffect(() => {
    if (session?.user) {
      fetchTodos();
    } else {
      setTodos([]);
      setLoading(false);
    }
  }, [session?.user]);

  const value: TodoContextType = {
    todos,
    loading,
    error,
    createTodo,
    updateTodo: updateTodoHandler,
    deleteTodo: deleteTodoHandler,
    toggleTodo: toggleTodoHandler,
    refetch: fetchTodos,
    clearAllTodos: async () => {
      if (!session?.user) return;
      try {
        setError(null);
        const result = await clearAllTodos(session.user.id);
        setTodos([]);
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to clear todos");
        throw err;
      }
    },
    selectAllTodos,
    unselectAllTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
