import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { CreateTodoData, Todo, UpdateTodoData } from "@/types/todo";
import { useEffect, useState } from "react";

export const useTodos = () => {
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

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTodos(data || []);
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

      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            user_id: session.user.id,
            title: todoData.title,
            description: todoData.description || null,
            completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setTodos((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create todo");
      throw err;
    }
  };

  // Update a todo
  const updateTodo = async (id: string, updates: UpdateTodoData) => {
    try {
      setError(null);

      const { data, error } = await supabase
        .from("todos")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      setTodos((prev) => prev.map((todo) => (todo.id === id ? data : todo)));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update todo");
      throw err;
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    try {
      setError(null);

      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
      throw err;
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    return updateTodo(id, { completed: !todo.completed });
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

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refetch: fetchTodos,
  };
};
