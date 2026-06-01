// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { COLORS } from "../constants/colors";

// export default function Header({ title, navigation, color = COLORS.customer }) {
//   return (
//     <LinearGradient colors={[color, color]} style={styles.header}>
//       {navigation?.canGoBack?.() ? (
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//       ) : (
//         <View style={{ width: 24 }} />
//       )}

//       <Text style={styles.title}>{title}</Text>

//       <Ionicons name="notifications-outline" size={23} color="#fff" />
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     paddingTop: 45,
//     paddingBottom: 16,
//     paddingHorizontal: 18,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   title: {
//     color: "#fff",
//     fontSize: 19,
//     fontWeight: "800",
//   },
// });















import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../constants/colors";

export default function Header({
  title,
  navigation,
  color = COLORS.customer,
  rightIcon,
  onRightPress,
}) {
  return (
    <LinearGradient colors={[color, color]} style={styles.header}>
      {navigation?.canGoBack?.() ? (
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconSpace} />
      )}

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {rightIcon ? (
        <TouchableOpacity style={styles.iconBtn} onPress={onRightPress} activeOpacity={0.75}>
          <Ionicons name={rightIcon} size={23} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconSpace} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 45,
    paddingBottom: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  iconSpace: {
    width: 32,
    height: 32,
  },
  title: {
    flex: 1,
    textAlign: "center",
    color: "#fff",
    fontSize: 19,
    fontWeight: "800",
    marginHorizontal: 10,
  },
});