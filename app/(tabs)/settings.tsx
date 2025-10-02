import Account from "@/components/Account";
import { useAuth } from "@/hooks/useAuth";
import useTheme from "@/hooks/useTheme";
import { Button, Text } from "@rneui/themed";
import { StyleSheet, View } from "react-native";

const settings = () => {
  const { session } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Please log in to access settings</Text>
      </View>
    );
  }

  return (
    <View style={styles.settingsContainer}>
      <View style={styles.themeSection}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <Button
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          onPress={toggleDarkMode}
          buttonStyle={styles.themeButton}
        />
      </View>

      <View style={styles.accountSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Account session={session} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  themeSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  accountSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  themeButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 6,
    paddingVertical: 12,
  },
});

export default settings;
