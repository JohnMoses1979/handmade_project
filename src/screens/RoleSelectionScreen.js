

// // src/screens/RoleSelectionScreen.js

// import React from "react";
// import {
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const COLORS = {
//   customer: "#2563EB",
//   seller: "#16A34A",
//   admin: "#082843",
//   text: "#0F172A",
//   muted: "#64748B",
// };

// export default function RoleSelectionScreen({ navigation }) {
//   const openRole = (role) => {
//     if (role === "seller") {
//       navigation.navigate("SellerOnboardingScreen");
//     } else if (role === "customer") {
//       navigation.navigate("CustomerOnboardingScreen");
//     } else if (role === "admin") {
//       navigation.navigate("AdminDashboardScreen"); // Admin goes straight to login
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Choose Your Role</Text>
//       <Text style={styles.subTitle}>Select your account type to continue</Text>

//       <RoleCard
//         icon="person"
//         title="Customer"
//         color={COLORS.customer}
//         onPress={() => openRole("customer")}
//       />

//       <RoleCard
//         icon="storefront"
//         title="Seller"
//         color={COLORS.seller}
//         onPress={() => openRole("seller")}
//       />

//       <RoleCard
//         icon="shield-checkmark"
//         title="Admin"
//         color={COLORS.admin}
//         onPress={() => openRole("admin")}
//       />
//     </SafeAreaView>
//   );
// }

// function RoleCard({ icon, title, color, onPress }) {
//   return (
//     <TouchableOpacity
//       style={[styles.card, { borderColor: color }]}
//       onPress={onPress}
//     >
//       <Ionicons name={icon} size={36} color={color} />
//       <Text style={[styles.cardText, { color }]}>{title}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     padding: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "900",
//     textAlign: "center",
//     marginBottom: 20,
//     color: COLORS.text,
//   },
//   subTitle: {
//     textAlign: "center",
//     color: COLORS.muted,
//     marginBottom: 25,
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 18,
//     alignItems: "center",
//     marginVertical: 10,
//     elevation: 4,
//     borderWidth: 2,
//   },
//   cardText: {
//     fontSize: 18,
//     fontWeight: "900",
//     marginTop: 10,
//   },
// });













// src/screens/RoleSelectionScreen.js

import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  customer: "#2563EB",
  seller: "#16A34A",
  admin: "#082843",
  text: "#0F172A",
  muted: "#64748B",
};

export default function RoleSelectionScreen({ navigation }) {
  const openRole = (role) => {
    if (role === "seller") {
      navigation.navigate("SellerOnboardingScreen");
    } else if (role === "customer") {
      navigation.navigate("CustomerOnboardingScreen");
    } else if (role === "admin") {
      navigation.navigate("AdminLoginScreen");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subTitle}>Select your account type to continue</Text>

      <RoleCard
        icon="person"
        title="Customer"
        color={COLORS.customer}
        onPress={() => openRole("customer")}
      />

      <RoleCard
        icon="storefront"
        title="Seller"
        color={COLORS.seller}
        onPress={() => openRole("seller")}
      />

      <RoleCard
        icon="shield-checkmark"
        title="Admin"
        color={COLORS.admin}
        onPress={() => openRole("admin")}
      />
    </SafeAreaView>
  );
}

function RoleCard({ icon, title, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Ionicons name={icon} size={36} color={color} />
      <Text style={[styles.cardText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.text,
  },
  subTitle: {
    textAlign: "center",
    color: COLORS.muted,
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    alignItems: "center",
    marginVertical: 10,
    elevation: 4,
    borderWidth: 2,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 10,
  },
});