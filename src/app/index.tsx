import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type QuestProps = {
  icon: string;
  title: string;
  description: string;
  xp: number;
  coins: number;
};

function QuestCard({
  icon,
  title,
  description,
  xp,
  coins
}: QuestProps) {
  return (
    <Pressable style={styles.questCard}>
      <View style={styles.questIcon}>
        <Text style={styles.questEmoji}>{icon}</Text>
      </View>

      <View style={styles.questContent}>
        <Text style={styles.questTitle}>{title}</Text>
        <Text style={styles.questDescription}>{description}</Text>
        
        <View style={styles.rewardRow}>
          <Text style={styles.xpText}>⚡ +{xp} XP</Text>
          <Text style={styles.coinText}>🪙 +{coins}</Text>
        </View>
      </View>

      <View style={styles.checkbox}/>
    </Pressable>

  );
}

export default function HomeScreen() {
  return(
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>WELCOME BACK</Text>
            <Text style={styles.playerName}>Priyam ⚔️</Text>
          </View>

          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LVL 1</Text>
          </View>
        </View>

        {/* XP Card */}
        <View style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>CURRENT EXPERIENCE</Text>
            <Text style={styles.xpAmount}>320 / 500 XP</Text>
          </View>

          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.nextLevel}>
            180 XP until Level 2 🚀
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>DAY STREAK</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🪙</Text>
            <Text style={styles.statNumber}>250</Text>
            <Text style={styles.statLabel}>COINS</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⚔️</Text>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>QUESTS</Text>
          </View>
        </View>

        {/* Quests */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY'S QUESTS</Text>
          <Text style={styles.questCount}>0 / 3</Text>
        </View>

        <QuestCard
          icon="💻"
          title="Deep Work"
          description="2 hours of focused work"
          xp={100}
          coins={20}
        />

        <QuestCard
          icon="💪"
          title="Workout"
          description="Complete your workout"
          xp={50}
          coins={10}
        />

        <QuestCard
          icon="🧠"
          title="Learning"
          description="Study for 30 minutes"
          xp={30}
          coins={5}
        />
      </ScrollView>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },

  scrollContent: {
    padding: 20,
    paddingTop: 70,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  greeting: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  playerName: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },

  levelBadge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  levelText: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 13,
  },

  xpCard: {
    backgroundColor: "#1F2937",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },

  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  xpLabel: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },

  xpAmount: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  progressBackground: {
    height: 12,
    backgroundColor: "#374151",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    width: "64%",
    backgroundColor: "#8B5CF6",
    borderRadius: 10,
  },

  nextLevel: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 12,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 30,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#1F2937",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },

  statEmoji: {
    fontSize: 20,
    marginBottom: 5,
  },

  statNumber: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },

  statLabel: {
    color: "#9CA3AF",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  questCount: {
    color: "#8B5CF6",
    fontWeight: "700",
  },

  questCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },

  questIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  questEmoji: {
    fontSize: 24,
  },

  questContent: {
    flex: 1,
  },

  questTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  questDescription: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 3,
  },

  rewardRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  xpText: {
    color: "#A78BFA",
    fontSize: 11,
    fontWeight: "700",
  },

  coinText: {
    color: "#FBBF24",
    fontSize: 11,
    fontWeight: "700",
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#6B7280",
    borderRadius: 12,
    marginLeft: 10,
  }
});


