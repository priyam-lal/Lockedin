import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type Quest = {
  id: number;
  icon: string;
  title: string;
  description: string;
  xp: number;
  coins: number;
  completed: boolean;
};

type User = {
  xp: number;
  coins: number;
  quests: Quest[];
  level: number;
}

const STORAGE_KEY = "@lockedin_game_state";

const initialQuests: Quest[] = [
  {
    id: 1,
    icon: "💻",
    title: "Deep Work",
    description: "2 hours of focused work",
    xp: 150,
    coins: 20,
    completed: false,
  },
  {
    id: 2,
    icon: "💪",
    title: "Workout",
    description: "Complete your workout",
    xp: 80,
    coins: 10,
    completed: false,
  },
  {
    id: 3,
    icon: "🧠",
    title: "Learning",
    description: "Study for 30 minutes",
    xp: 390,
    coins: 5,
    completed: false,
  }
];

export default function HomeScreen() {
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [quests, setQuests] = useState(initialQuests);
  const [level, setLevel] = useState(1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [bonusCoins, setBonusCoins] = useState(0);
  const [levelReached, setLevelReached] = useState(1);

  const storeData = async (value: User) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.log("Saving Error");
    }
  };

  const updateState = async () => {
    try {
      const savedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (!savedData) {
        return;
      }
      const parsedData = JSON.parse(savedData);
      setXp(parsedData.xp);
      setCoins(parsedData.coins);
      setQuests(parsedData.quests);
      setLevel(parsedData.level ?? 1);
    } catch (e) {
      console.log("Updating Error");
    }
  };

  const completedQuests = quests.filter(
    (quest) => quest.completed
  ).length;

  const getXpRequired = (level: number) => level * 100;

  const completeQuest = async (questId: number) => {
    const quest = quests.find((q) => q.id === questId);

    if (!quest || quest.completed) {
      return;
    }

    let newXp = xp + quest.xp;
    let newCoins = coins + quest.coins;
    const newQuests = quests.map((q) => q.id === questId ? { ...q, completed: true } : q);
    let newLevel = level;
    while (newXp >= getXpRequired(newLevel)) {
      newXp -= getXpRequired(newLevel);
      newLevel++;
    }
    if (newLevel > level) {
      const bonus = (newLevel - level) * 50;
      setBonusCoins(bonus);
      setLevelReached(newLevel);
      setShowLevelUp(true);
      newCoins += bonus;
    }

    setXp(newXp);
    setCoins(newCoins);
    setQuests(newQuests);
    setLevel(newLevel);

    await storeData({
      xp: newXp,
      coins: newCoins,
      quests: newQuests,
      level: newLevel
    });
  };

  const xpNeededForNextLevel = getXpRequired(level);
  const progressPercentage = Math.min((xp / xpNeededForNextLevel) * 100, 100);

  useEffect(() => {
    const refreshState = async () => {
      await updateState();
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
    refreshState();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Modal
        visible={showLevelUp}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.levelUpModal}>

            {/* Celebration icon */}
            <Text style={styles.levelUpEmoji}>🎉</Text>

            {/* Level-up heading */}
            <Text style={styles.levelUpTitle}>LEVEL UP!</Text>

            {/* Display levelReached */}
            <Text style={styles.levelReachedText}>LEVEL {levelReached}</Text>

            {/* Display bonus reward */}
            <Text style={styles.bonusText}>+{bonusCoins} 🪙</Text>

            <Pressable
              style={styles.modalButton}
              onPress={() => setShowLevelUp(false)}
            >
              <Text style={styles.modalButtonText}>AWESOME!</Text>
            </Pressable>

          </View>
        </View>
      </Modal>

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
            <Text style={styles.levelText}>{level}</Text>
          </View>
        </View>

        {/* XP Card */}
        <View style={styles.xpCard}>
          <View style={styles.xpHeader}>
            <Text style={styles.xpLabel}>CURRENT EXPERIENCE</Text>
            <Text style={styles.xpAmount}>{xp} / {xpNeededForNextLevel} XP</Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>

          <Text style={styles.nextLevel}>
            {Math.max(xpNeededForNextLevel - xp, 0)} XP until Level {level + 1} 🚀
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
            <Text style={styles.statNumber}>{coins}</Text>
            <Text style={styles.statLabel}>COINS</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⚔️</Text>
            <Text style={styles.statNumber}>{completedQuests}</Text>
            <Text style={styles.statLabel}>QUESTS</Text>
          </View>
        </View>

        {/* Quests */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY'S QUESTS</Text>
          <Text style={styles.questCount}>{completedQuests} / {quests.length}</Text>
        </View>

        {quests.map((quest) => (
          <Pressable
            key={quest.id}
            onPress={() => completeQuest(quest.id)}
            style={[styles.questCard, quest.completed && styles.completedQuestCard]}
          >
            <View style={styles.questIcon}>
              <Text style={styles.questEmoji}>
                {quest.icon}
              </Text>
            </View>
            <View style={styles.questContent}>
              <Text
                style={[
                  styles.questTitle,
                  quest.completed && styles.completedText,
                ]}
              >
                {quest.title}
              </Text>

              <Text style={styles.questDescription}>
                {quest.description}
              </Text>

              <View style={styles.rewardRow}>
                <Text style={styles.xpText}>
                  ⚡ +{quest.xp} XP
                </Text>

                <Text style={styles.coinText}>
                  🪙 +{quest.coins}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.checkbox,
                quest.completed && styles.completedCheckbox,
              ]}
            >
              {quest.completed && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
          </Pressable>
        ))}
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

  completedQuestCard: {
    opacity: 0.55,
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

  completedText: {
    textDecorationLine: "line-through",
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
    justifyContent: "center",
    alignItems: "center",
  },

  completedCheckbox: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },

  checkmark: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  levelUpModal: {
    width: "100%",
    backgroundColor: "#1F2937",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
  },

  levelUpEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },

  levelUpTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 12,
  },

  levelReachedText: {
    color: "#A78BFA",
    fontSize: 20,
    fontWeight: "800",
  },

  bonusText: {
    color: "#FBBF24",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },

  modalButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginTop: 28,
  },

  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  }
});


