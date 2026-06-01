// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   StatusBar,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const C = {
//   primary: "#082843",
//   white: "#FFFFFF",
//   bg: "#FFFFFF",
//   text: "#111827",
//   muted: "#6B7280",
//   border: "#F3D3E2",
//   soft: "#FFFFFF",
//   green: "#16A34A",
//   orange: "#F59E0B",
//   blue: "#2563EB",
// };

// const initialNotifications = [
//   {
//     id: "1",
//     title: "New order received",
//     message: "Order #ORD12345 has been placed by Riya Sharma.",
//     time: "10:30 AM",
//     icon: "bag-handle-outline",
//     color: C.primary,
//     read: false,
//   },
//   {
//     id: "2",
//     title: "Payment received",
//     message: "₹1,290 payment received successfully.",
//     time: "9:15 AM",
//     icon: "card-outline",
//     color: C.green,
//     read: false,
//   },
//   {
//     id: "3",
//     title: "Payout successful",
//     message: "Your payout of ₹8,560 is successfully processed.",
//     time: "Yesterday",
//     icon: "wallet-outline",
//     color: C.orange,
//     read: true,
//   },
//   {
//     id: "4",
//     title: "Product approved",
//     message: "Macrame Wall Hanging is now live in your store.",
//     time: "2 Apr",
//     icon: "checkmark-circle-outline",
//     color: C.blue,
//     read: true,
//   },
// ];

// export default function SellerNotificationScreen({ navigation }) {
//   const [notifications, setNotifications] = useState(initialNotifications);

//   const markAllRead = () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//   };

//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" backgroundColor={C.white} />

//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={26} color={C.text} />
//         </TouchableOpacity>

//         <Text style={styles.headerTitle}>Notifications</Text>

//         <TouchableOpacity onPress={markAllRead}>
//           <Text style={styles.markText}>Read all</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
//         {notifications.map((item) => (
//           <TouchableOpacity
//             key={item.id}
//             style={[styles.card, !item.read && styles.unreadCard]}
//             activeOpacity={0.85}
//             onPress={() =>
//               setNotifications((prev) =>
//                 prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
//               )
//             }
//           >
//             <View style={[styles.iconBox, { backgroundColor: item.color + "18" }]}>
//               <Ionicons name={item.icon} size={22} color={item.color} />
//             </View>

//             <View style={{ flex: 1 }}>
//               <View style={styles.row}>
//                 <Text style={styles.title}>{item.title}</Text>
//                 {!item.read && <View style={styles.dot} />}
//               </View>
//               <Text style={styles.message}>{item.message}</Text>
//               <Text style={styles.time}>{item.time}</Text>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: C.bg,
//   },
//   header: {
//     height: 64,
//     paddingHorizontal: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderBottomWidth: 1,
//     borderBottomColor: C.border,
//   },
//   backBtn: {
//     width: 42,
//     height: 42,
//     borderRadius: 21,
//     backgroundColor: C.soft,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "900",
//     color: C.text,
//   },
//   markText: {
//     color: C.primary,
//     fontWeight: "900",
//     fontSize: 13,
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   card: {
//     backgroundColor: C.white,
//     borderRadius: 18,
//     padding: 14,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: C.border,
//     flexDirection: "row",
//     gap: 12,
//   },
//   unreadCard: {
//     backgroundColor: "#FFF7FB",
//   },
//   iconBox: {
//     width: 46,
//     height: 46,
//     borderRadius: 15,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   title: {
//     flex: 1,
//     fontSize: 14,
//     fontWeight: "900",
//     color: C.text,
//   },
//   dot: {
//     width: 9,
//     height: 9,
//     borderRadius: 5,
//     backgroundColor: C.primary,
//   },
//   message: {
//     marginTop: 4,
//     fontSize: 13,
//     color: C.muted,
//     lineHeight: 19,
//     fontWeight: "600",
//   },
//   time: {
//     marginTop: 7,
//     fontSize: 11,
//     color: C.muted,
//     fontWeight: "700",
//   },
// });











































// src/screens/seller/SellerNotificationsScreen.js

import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";

const C = {
  primary: "#082843",
  white: "#FFFFFF",
  bg: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#F3D3E2",
  soft: "#FFFFFF",
  green: "#16A34A",
  orange: "#F59E0B",
  blue: "#2563EB",
};

const initialNotifications = [
  {
    id: "1",
    title: "New order received",
    message: "Order #ORD12345 has been placed by Riya Sharma.",
    time: "10:30 AM",
    icon: "bag-handle-outline",
    color: C.primary,
    read: false,
  },
  {
    id: "2",
    title: "Payment received",
    message: "₹1,290 payment received successfully.",
    time: "9:15 AM",
    icon: "card-outline",
    color: C.green,
    read: false,
  },
  {
    id: "3",
    title: "Payout successful",
    message: "Your payout of ₹8,560 is successfully processed.",
    time: "Yesterday",
    icon: "wallet-outline",
    color: C.orange,
    read: true,
  },
  {
    id: "4",
    title: "Product approved",
    message: "Macrame Wall Hanging is now live in your store.",
    time: "2 Apr",
    icon: "checkmark-circle-outline",
    color: C.blue,
    read: true,
  },
];

export default function SellerNotificationScreen({ navigation }) {
  const {
    sellerNotifications: notifications = [],
    markSellerNotificationRead,
    markAllSellerNotificationsRead,
  } = useShop();

  const markAllRead = () => {
    markAllSellerNotificationsRead?.();
  };

  useFocusEffect(
    useCallback(() => {
      markAllSellerNotificationsRead?.();
    }, [markAllSellerNotificationsRead])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={26} color={C.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <TouchableOpacity onPress={markAllRead}>
          <Text style={styles.markText}>Read all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, !item.read && styles.unreadCard]}
            activeOpacity={0.85}
            onPress={() => markSellerNotificationRead?.(item.id)}
          >
            <View
              style={[
                styles.iconBox,
                {
                  backgroundColor: `${item.iconColor || item.color || C.primary}18`,
                },
              ]}
            >
              <Ionicons
                name={item.icon || "notifications-outline"}
                size={22}
                color={item.iconColor || item.color || C.primary}
              />
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.row}>
                <Text style={styles.title}>{item.title}</Text>
                {!item.read && <View style={styles.dot} />}
              </View>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: C.text,
  },
  markText: {
    color: C.primary,
    fontWeight: "900",
    fontSize: 13,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: "row",
    gap: 12,
  },
  unreadCard: {
    backgroundColor: "#FFF7FB",
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: "900",
    color: C.text,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.primary,
  },
  message: {
    marginTop: 4,
    fontSize: 13,
    color: C.muted,
    lineHeight: 19,
    fontWeight: "600",
  },
  time: {
    marginTop: 7,
    fontSize: 11,
    color: C.muted,
    fontWeight: "700",
  },
});
