import { createHomeStyles } from "@/assets/styles/home.styles";
import { useTodos } from "@/contexts/TodoContext";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";

const TodoInput = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);
  const { createTodo } = useTodos();

  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      await createTodo({ title: newTodo.trim() });
      setNewTodo(""); // Clear input after successful save
    } catch (error) {
      console.log("Error adding a todo", error);
      Alert.alert("Error", "Failed to add todo");
    }
  };
  return (
    <View style={homeStyles.inputSection}>
      <View style={homeStyles.inputWrapper}>
        <TextInput
          style={homeStyles.input}
          placeholder="What needs to be done?"
          value={newTodo}
          onChangeText={setNewTodo}
          onSubmitEditing={handleAddTodo}
          placeholderTextColor={colors.textMuted}
        />
        <TouchableOpacity
          onPress={handleAddTodo}
          activeOpacity={0.8}
          disabled={!newTodo.trim()}
        >
          <LinearGradient
            colors={
              newTodo.trim() ? colors.gradients.primary : colors.gradients.muted
            }
            style={[
              homeStyles.addButton,
              !newTodo.trim() && homeStyles.addButtonDisabled,
            ]}
          >
            <Ionicons name="add-outline" size={24} color={"#ffffff"} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TodoInput;
