import { createHomeStyles } from "@/assets/styles/home.styles";
import { useTodos } from "@/contexts/TodoContext";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

const Header = () => {
  const { colors } = useTheme();
  const { todos, loading, error } = useTodos();
  const homeStyles = createHomeStyles(colors);

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const totalTodos = todos.length;

  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <View style={homeStyles.header}>
      <View style={homeStyles.titleContainer}>
        <LinearGradient
          colors={colors.gradients.primary}
          style={homeStyles.iconContainer}
        >
          <Ionicons name="flash-outline" size={28} color={"#ffffff"} />
        </LinearGradient>

        <View style={homeStyles.titleTextContainer}>
          <Text style={homeStyles.title}>Today&apos;s Todos</Text>
          <Text
            style={homeStyles.subtitle}
          >{`${completedTodos} of ${totalTodos} completed`}</Text>
        </View>
      </View>
      <View style={homeStyles.progressContainer}>
        <View style={homeStyles.progressBarContainer}>
          <View style={[homeStyles.progressBar]}>
            <LinearGradient
              colors={colors.gradients.success}
              style={[homeStyles.progressFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={homeStyles.progressText}>{`${Math.round(
            progress
          )}%`}</Text>
        </View>
      </View>
    </View>
  );
};

export default Header;
