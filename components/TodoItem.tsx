import { Todo } from "@/types/todo";
import { Button, CheckBox, Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const handleToggle = () => {
    onToggle(todo.id);
  };

  const handleDelete = () => {
    onDelete(todo.id);
  };

  return (
    <View style={[styles.container, todo.completed && styles.completed]}>
      <View style={styles.content}>
        <CheckBox
          checked={todo.completed}
          onPress={handleToggle}
          containerStyle={styles.checkbox}
        />
        <View style={styles.textContainer}>
          <Text style={[styles.title, todo.completed && styles.completedText]}>
            {todo.title}
          </Text>
          {todo.description && (
            <Text
              style={[
                styles.description,
                todo.completed && styles.completedText,
              ]}
            >
              {todo.description}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.actions}>
        {onEdit && (
          <Button
            title="Edit"
            type="clear"
            size="sm"
            onPress={() => onEdit(todo.id)}
          />
        )}
        <Button
          title="Delete"
          type="clear"
          size="sm"
          buttonStyle={styles.deleteButton}
          titleStyle={styles.deleteButtonText}
          onPress={handleDelete}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginVertical: 4,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completed: {
    backgroundColor: "#f8f9fa",
    opacity: 0.7,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 8,
    padding: 0,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1e293b",
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: "#64748b",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#94a3b8",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 8,
  },
  deleteButtonText: {
    color: "#ef4444",
    fontSize: 12,
  },
});
