
// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   ScrollView,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// const COLORS = {
//   primary: "#082843",
//   primaryDark: "#082843",
//   bg: "#FFF8F2",
//   white: "#FFFFFF",
//   text: "#1F2937",
//   muted: "#6B7280",
//   border: "#F2D6E4",
// };

// const onboardingItems = [
//   {
//     id: "1",
//     title: "Homemade Sweets",
//     image: require("../../../assets/images/sweets/laddu/laddu1.png"),
//   },
//   {
//     id: "2",
//     title: "Festival Rakhis",
//     image: require("../../../assets/images/festive/rakhis/rakhi1.png"),
//   },
//   {
//     id: "3",
//     title: "Ganesh Idols",
//     image: require("../../../assets/images/festive/ganesh/ganesh1.png"),
//   },
//   {
//     id: "4",
//     title: "Pickles",
//     image: require("../../../assets/images/pickles/mango/mango1.png"),
//   },
// ];

// export default function CustomerOnboardingScreen({ navigation }) {
//   const goToCustomerLogin = () => {
//     // Use navigate if replace is not behaving as expected
//     navigation.replace("CustomerLoginScreen");
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View style={styles.topRow}>
//           <View />
//           <TouchableOpacity activeOpacity={0.8} onPress={goToCustomerLogin}>
//             <Text style={styles.skip}>Skip</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.header}>
//           <Text style={styles.smallTitle}>Discover Unique</Text>
//           <Text style={styles.bigTitle}>Handmade Items</Text>
//           <Text style={styles.subtitle}>
//             Fresh sweets, festival items, pickles, handmade gifts and home decor
//             from trusted local sellers.
//           </Text>
//         </View>

//         <View style={styles.imageGrid}>
//           {onboardingItems.map((item) => (
//             <View key={item.id} style={styles.imageCard}>
//               <Image source={item.image} style={styles.image} resizeMode="cover" />
//               <View style={styles.imageOverlay}>
//                 <Text style={styles.imageText}>{item.title}</Text>
//               </View>
//             </View>
//           ))}
//         </View>

//         <View style={styles.infoCard}>
//           <View style={styles.iconCircle}>
//             <Ionicons name="heart" size={24} color={COLORS.primary} />
//           </View>

//           <View style={{ flex: 1 }}>
//             <Text style={styles.infoTitle}>Made by Local Artisans</Text>
//             <Text style={styles.infoSub}>
//               Shop handmade products directly from small businesses, home makers
//               and festival sellers.
//             </Text>
//           </View>
//         </View>

//         <View style={styles.featureRow}>
//           <View style={styles.featureCard}>
//             <Ionicons name="shield-checkmark-outline" size={22} color={COLORS.primary} />
//             <Text style={styles.featureText}>Secure Orders</Text>
//           </View>

//           <View style={styles.featureCard}>
//             <Ionicons name="cube-outline" size={22} color={COLORS.primary} />
//             <Text style={styles.featureText}>Fast Delivery</Text>
//           </View>

//           <View style={styles.featureCard}>
//             <Ionicons name="storefront-outline" size={22} color={COLORS.primary} />
//             <Text style={styles.featureText}>Local Sellers</Text>
//           </View>
//         </View>

//         <View style={styles.bottomRow}>
//           <View style={styles.dots}>
//             <View style={styles.activeDot} />
//             <View style={styles.dot} />
//             <View style={styles.dot} />
//             <View style={styles.dot} />
//           </View>

//           <TouchableOpacity
//             style={styles.nextButton}
//             activeOpacity={0.88}
//             onPress={goToCustomerLogin} // Ensure this is navigating to the right screen
//           >
//             <Text style={styles.nextText}>Get Started</Text>
//             <Ionicons name="arrow-forward" size={19} color="#fff" />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFFFFF",
//   },

//   topRow: {
//     paddingHorizontal: 24,
//     paddingTop: 14,
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },

//   skip: {
//     color: COLORS.muted,
//     fontSize: 15,
//     fontWeight: "800",
//   },

//   header: {
//     paddingHorizontal: 24,
//     marginTop: 25,
//   },

//   smallTitle: {
//     fontSize: 29,
//     color: COLORS.primaryDark,
//     fontWeight: "500",
//   },

//   bigTitle: {
//     fontSize: 34,
//     color: COLORS.primary,
//     fontWeight: "900",
//     marginTop: 2,
//   },

//   subtitle: {
//     marginTop: 18,
//     fontSize: 17,
//     color: COLORS.text,
//     lineHeight: 25,
//     fontWeight: "600",
//   },

//   imageGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     paddingHorizontal: 18,
//     marginTop: 28,
//   },

//   imageCard: {
//     width: "47%",
//     height: 160,
//     margin: "1.5%",
//     borderRadius: 22,
//     overflow: "hidden",
//     backgroundColor: COLORS.white,
//     elevation: 4,
//     shadowColor: "#B01863",
//     shadowOpacity: 0.16,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//   },

//   image: {
//     width: "100%",
//     height: "100%",
//   },

//   imageOverlay: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     padding: 10,
//     backgroundColor: "rgba(0,0,0,0.36)",
//   },

//   imageText: {
//     color: "#fff",
//     fontWeight: "900",
//     fontSize: 13,
//   },

//   infoCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: COLORS.white,
//     marginHorizontal: 24,
//     marginTop: 26,
//     padding: 16,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     elevation: 3,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 4 },
//   },

//   iconCircle: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: "#FFE3EF",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 14,
//   },

//   infoTitle: {
//     fontSize: 16,
//     fontWeight: "900",
//     color: COLORS.text,
//   },

//   infoSub: {
//     marginTop: 5,
//     color: COLORS.muted,
//     lineHeight: 20,
//     fontWeight: "600",
//   },

//   featureRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginHorizontal: 24,
//     marginTop: 16,
//   },

//   featureCard: {
//     flex: 1,
//     minHeight: 82,
//     backgroundColor: COLORS.white,
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: COLORS.border,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//     elevation: 2,
//   },

//   featureText: {
//     marginTop: 7,
//     fontSize: 11,
//     fontWeight: "900",
//     color: COLORS.text,
//     textAlign: "center",
//   },

//   bottomRow: {
//     paddingHorizontal: 24,
//     marginTop: 36,
//     marginBottom: 30,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   dots: {
//     flexDirection: "row",
//     gap: 8,
//   },

//   activeDot: {
//     width: 22,
//     height: 8,
//     borderRadius: 8,
//     backgroundColor: COLORS.primary,
//   },

//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 8,
//     backgroundColor: "#E5D5DC",
//   },

//   nextButton: {
//     height: 50,
//     paddingHorizontal: 22,
//     borderRadius: 16,
//     backgroundColor: COLORS.primary,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     elevation: 4,
//   },

//   nextText: {
//     color: "#fff",
//     fontSize: 15,
//     fontWeight: "900",
//   },
// });
































// screens/customer/CustomerOnboardingScreen.js

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import {
  getAuthSession,
  getCustomerAccount,
  setAuthSession,
} from "../../utils/authSession";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";
import { markCustomerOnboardingSeenAPI } from "../../api/customerApi";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#062B67",
  bg: "#FFFFFF",
  white: "#FFFFFF",
  text: "#1F2937",
  muted: "#5F6673",
  border: "#EFEFEF",
  shadow: "rgba(0,0,0,0.08)",
};

const onboardingItems = [
  {
    id: "1",
    title: "Homemade Sweets",
    image: require("../../../assets/images/sweets/laddu/laddu1.png"),
  },
  {
    id: "2",
    title: "Festival Rakhis",
    image: require("../../../assets/images/festive/rakhis/rakhi1.png"),
  },
  {
    id: "3",
    title: "Ganesh Idols",
    image: require("../../../assets/images/festive/ganesh/ganesh1.png"),
  },
  {
    id: "4",
    title: "Pickles",
    image: require("../../../assets/images/pickles/mango/mango1.png"),
  },
];

export default function CustomerOnboardingScreen({ navigation }) {
  const { reloadCustomerCommerceData, reloadCustomerAddresses } = useShop();

  const handleGetStarted = () => {
    const customer = getCustomerAccount();
    const session = getAuthSession();
    const email = customer?.email ?? session?.email ?? "";

    if (email) {
      markCustomerOnboardingSeenAPI(email).finally(() => {
        setAuthSession({
          role: "customer",
          email: customer?.email ?? session?.email ?? "",
          phone: customer?.phone ?? session?.phone ?? "",
          name: customer?.name ?? session?.name ?? "",
          location: customer?.location ?? session?.location ?? "",
          bio: customer?.bio ?? session?.bio ?? "",
          avatar: customer?.avatar ?? session?.avatar ?? null,
        });
        reloadCustomerCommerceData?.();
        reloadCustomerAddresses?.();
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "CustomerTabs",
              params: {
                screen: "HomeTab",
                params: {
                  screen: "CustomerHomeMain",
                },
              },
            },
          ],
        });
      });
      return;
    }

    navigation.replace("CustomerLoginScreen", { role: "customer" });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.smallTitle}>Discover Unique</Text>

          <Text style={styles.bigTitle}>Handmade Items</Text>

          <Text style={styles.subtitle}>
            Fresh sweets, festival items, pickles, handmade gifts and home decor
            from trusted local sellers.
          </Text>
        </View>

        {/* GRID */}
        <View style={styles.gridContainer}>
          {onboardingItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image
                source={item.image}
                style={styles.cardImage}
                resizeMode="cover"
              />

              <View style={styles.overlay}>
                <Text numberOfLines={1} style={styles.overlayText}>
                  {item.title}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ARTISAN CARD */}
        <View style={styles.infoCard}>
          <View style={styles.heartCircle}>
            <Ionicons name="heart" size={28} color={COLORS.primary} />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Made by Local Artisans</Text>

            <Text style={styles.infoText}>
              Shop handmade products directly from small businesses, home
              makers and festival sellers.
            </Text>
          </View>
        </View>

        {/* FEATURES */}
        <View style={styles.featureWrapper}>
          <View style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.featureText}>Secure Orders</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Ionicons
                name="cube-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.featureText}>Fast Delivery</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.featureCard}>
            <View style={styles.featureIconCircle}>
              <Ionicons
                name="storefront-outline"
                size={24}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.featureText}>Local Sellers</Text>
          </View>
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.button}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>

          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_SIZE = (width - 52) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scrollContainer: {
    paddingBottom: 35,
  },

  headerContainer: {
    paddingHorizontal: 22,
    marginTop: 20,
  },

  smallTitle: {
    fontSize: width * 0.08,
    color: COLORS.primary,
    fontWeight: "500",
  },

  bigTitle: {
    fontSize: width * 0.115,
    color: COLORS.primary,
    fontWeight: "900",
    lineHeight: width * 0.12,
    marginTop: 2,
  },

  subtitle: {
    marginTop: 18,
    fontSize: 17,
    lineHeight: 27,
    color: COLORS.text,
    fontWeight: "500",
    paddingRight: 10,
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 28,
  },

  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#F3F4F6",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  overlay: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  overlayText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  infoCard: {
    marginHorizontal: 18,
    marginTop: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    padding: 18,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  heartCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#FFF1F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 18,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
  },

  infoText: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 25,
    color: COLORS.text,
    fontWeight: "500",
  },

  featureWrapper: {
    marginHorizontal: 18,
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 22,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  featureCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  featureIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFF4F4",
    alignItems: "center",
    justifyContent: "center",
  },

  featureText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },

  divider: {
    width: 1,
    height: 70,
    backgroundColor: "#F1D9DF",
  },

  button: {
    marginTop: 28,
    marginHorizontal: 22,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 8,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    marginRight: 14,
  },
});
