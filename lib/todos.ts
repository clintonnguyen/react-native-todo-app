import { Todo } from "@/types/todo";
import { supabase } from "./supabase";

// Get all todos for the current user
export const getTodos = async (userId: string): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

// Add a new todo
export const addTodo = async (userId: string, text: string): Promise<Todo> => {
  const { data, error } = await supabase
    .from("todos")
    .insert([
      {
        user_id: userId,
        title: text,
        completed: false,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Toggle todo completion
export const toggleTodo = async (id: string): Promise<Todo> => {
  // First get the current todo
  const { data: currentTodo, error: fetchError } = await supabase
    .from("todos")
    .select("completed")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;
  if (!currentTodo) throw new Error("Todo not found");

  // Update with opposite completion status
  const { data, error } = await supabase
    .from("todos")
    .update({
      completed: !currentTodo.completed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<void> => {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) throw error;
};

// Update todo text
export const updateTodo = async (id: string, text: string): Promise<Todo> => {
  const { data, error } = await supabase
    .from("todos")
    .update({
      title: text,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Clear all todos for the current user
export const clearAllTodos = async (
  userId: string
): Promise<{ deletedCount: number }> => {
  const { data, error } = await supabase
    .from("todos")
    .delete()
    .eq("user_id", userId)
    .select();

  if (error) throw error;
  return { deletedCount: data?.length || 0 };
};
