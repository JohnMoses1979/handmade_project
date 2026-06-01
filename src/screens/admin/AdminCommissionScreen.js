













// src/screens/admin/AdminCommissionScreen.js

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useShop } from "../../context/ShopContext";

const { width } = Dimensions.get("window");

const C = {
  primary: "#0e3243",
  secondary: "#0e3243",
  accent: "#10B981",
  orange: "#F59E0B",
  white: "#FFFFFF",
  bg: "#F3F6FB",
  card: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",
  border: "#E2E8F0",
  red: "#EF4444",
  green: "#10B981",
};

export default function AdminCommissionScreen({
  navigation,
}) {
  const [selected, setSelected] =
    useState(null);

  const {
    orders = [],
    formatPrice,
    cleanPrice,
  } = useShop();

  // TRANSACTIONS
  const transactions = useMemo(() => {
    return orders.map((order, index) => {
      const total =
        cleanPrice(
          order.totalAmount || order.price
        ) || 0;

      const admin =
        order.adminCommission ||
        total * 0.1;

      const seller =
        order.sellerEarning ||
        total * 0.9;

      return {
        id:
          order.id ||
          `ORD-${index + 1}`,

        product:
          order.title ||
          "Product Order",

        customer:
          order.customer ||
          "Customer",

        total,

        admin,

        seller,

        date:
          order.date || "Today",

        status:
          order.paymentStatus ||
          "Paid",
      };
    });
  }, [orders, cleanPrice]);

  // TOTALS
  const totalCommission =
    transactions.reduce(
      (a, b) => a + b.admin,
      0
    );

  const totalPayouts =
    transactions.reduce(
      (a, b) => a + b.seller,
      0
    );

  const totalRevenue =
    transactions.reduce(
      (a, b) => a + b.total,
      0
    );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={C.primary}
      />

      {/* HEADER */}
      <LinearGradient
        colors={[
          C.primary,
          C.secondary,
        ]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={C.white}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Commission Analytics
          </Text>

          <TouchableOpacity>
            <Ionicons
              name="stats-chart-outline"
              size={22}
              color={C.white}
            />
          </TouchableOpacity>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>
              Revenue
            </Text>

            <Text style={styles.statsValue}>
              {formatPrice(
                totalRevenue
              )}
            </Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>
              Admin 10%
            </Text>

            <Text
              style={[
                styles.statsValue,
                { color: "#FFD166" },
              ]}
            >
              {formatPrice(
                totalCommission
              )}
            </Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsLabel}>
              Seller 90%
            </Text>

            <Text
              style={[
                styles.statsValue,
                { color: "#86EFAC" },
              ]}
            >
              {formatPrice(
                totalPayouts
              )}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {/* BREAKDOWN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Commission Breakdown
          </Text>

          <View
            style={styles.breakdownWrap}
          >
            {/* DONUT */}
            <View
              style={styles.chartOuter}
            >
              <View
                style={styles.chartInner}
              >
                <Text
                  style={
                    styles.chartText
                  }
                >
                  10%
                </Text>

                <Text
                  style={
                    styles.chartSub
                  }
                >
                  Admin
                </Text>
              </View>
            </View>

            {/* LEGEND */}
            <View
              style={styles.legendWrap}
            >
              <View
                style={styles.legendRow}
              >
                <View
                  style={[
                    styles.legendDot,
                    {
                      backgroundColor:
                        C.orange,
                    },
                  ]}
                />

                <View>
                  <Text
                    style={
                      styles.legendTitle
                    }
                  >
                    Admin Commission
                  </Text>

                  <Text
                    style={
                      styles.legendAmount
                    }
                  >
                    {formatPrice(
                      totalCommission
                    )}
                  </Text>
                </View>
              </View>

              <View
                style={styles.legendRow}
              >
                <View
                  style={[
                    styles.legendDot,
                    {
                      backgroundColor:
                        C.green,
                    },
                  ]}
                />

                <View>
                  <Text
                    style={
                      styles.legendTitle
                    }
                  >
                    Seller Payout
                  </Text>

                  <Text
                    style={
                      styles.legendAmount
                    }
                  >
                    {formatPrice(
                      totalPayouts
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* DETAIL CARD */}
        {selected && (
          <View
            style={styles.detailCard}
          >
            <View
              style={
                styles.detailHeader
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Transaction Details
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setSelected(null)
                }
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={C.muted}
                />
              </TouchableOpacity>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={
                  styles.detailKey
                }
              >
                Order ID
              </Text>

              <Text
                style={
                  styles.detailValue
                }
              >
                {selected.id}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={
                  styles.detailKey
                }
              >
                Product
              </Text>

              <Text
                style={
                  styles.detailValue
                }
              >
                {selected.product}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={
                  styles.detailKey
                }
              >
                Customer
              </Text>

              <Text
                style={
                  styles.detailValue
                }
              >
                {selected.customer}
              </Text>
            </View>

            <View
              style={styles.divider}
            />

            <View
              style={styles.detailRow}
            >
              <Text
                style={
                  styles.detailKey
                }
              >
                Total Revenue
              </Text>

              <Text
                style={
                  styles.detailValue
                }
              >
                {formatPrice(
                  selected.total
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={
                  styles.detailKey
                }
              >
                Admin 10%
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color: C.orange,
                  },
                ]}
              >
                {formatPrice(
                  selected.admin
                )}
              </Text>
            </View>

            <View
              style={styles.detailRow}
            >
              <Text
                style={
                  styles.detailKey
                }
              >
                Seller 90%
              </Text>

              <Text
                style={[
                  styles.detailValue,
                  {
                    color: C.green,
                  },
                ]}
              >
                {formatPrice(
                  selected.seller
                )}
              </Text>
            </View>
          </View>
        )}

        {/* TRANSACTIONS */}
        <View style={styles.section}>
          <View
            style={
              styles.sectionHeader
            }
          >
            <Text
              style={
                styles.sectionTitle
              }
            >
              Recent Transactions
            </Text>

            <Text
              style={styles.count}
            >
              {
                transactions.length
              }
            </Text>
          </View>

          {transactions.length ===
          0 ? (
            <View
              style={
                styles.emptyWrap
              }
            >
              <Ionicons
                name="receipt-outline"
                size={70}
                color={C.muted}
              />

              <Text
                style={
                  styles.emptyText
                }
              >
                No transactions found
              </Text>
            </View>
          ) : (
            transactions.map(
              (
                item,
                index
              ) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={
                    0.8
                  }
                  style={[
                    styles.transactionCard,
                    selected?.id ===
                      item.id &&
                      styles.selectedCard,
                  ]}
                  onPress={() =>
                    setSelected(
                      item
                    )
                  }
                >
                  {/* LEFT */}
                  <View
                    style={
                      styles.transactionLeft
                    }
                  >
                    <View
                      style={
                        styles.iconWrap
                      }
                    >
                      <Ionicons
                        name="wallet-outline"
                        size={
                          22
                        }
                        color={
                          C.primary
                        }
                      />
                    </View>

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text
                        style={
                          styles.orderId
                        }
                      >
                        {
                          item.id
                        }
                      </Text>

                      <Text
                        style={
                          styles.productName
                        }
                      >
                        {
                          item.product
                        }
                      </Text>

                      <Text
                        style={
                          styles.customerText
                        }
                      >
                        {
                          item.customer
                        }
                      </Text>

                      <Text
                        style={
                          styles.dateText
                        }
                      >
                        {
                          item.date
                        }
                      </Text>
                    </View>
                  </View>

                  {/* RIGHT */}
                  <View
                    style={
                      styles.transactionRight
                    }
                  >
                    <Text
                      style={
                        styles.amountText
                      }
                    >
                      {formatPrice(
                        item.admin
                      )}
                    </Text>

                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.status ===
                            "Paid"
                              ? "#DCFCE7"
                              : "#FEF3C7",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              item.status ===
                              "Paid"
                                ? C.green
                                : C.orange,
                          },
                        ]}
                      >
                        {
                          item.status
                        }
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )
            )
          )}
        </View>

        <View
          style={{ height: 120 }}
        />
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
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  headerTitle: {
    color: C.white,
    fontSize: 20,
    fontWeight: "800",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },

  statsCard: {
    flex: 1,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: "center",
  },

  statsLabel: {
    color:
      "rgba(255,255,255,0.7)",
    fontSize: 11,
  },

  statsValue: {
    marginTop: 8,
    color: C.white,
    fontSize: 14,
    fontWeight: "800",
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  section: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.text,
  },

  count: {
    backgroundColor:
      "#EEF2FF",
    color: C.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontWeight: "800",
    fontSize: 11,
  },

  breakdownWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  chartOuter: {
    width: 120,
    height: 120,
    borderRadius: 80,
    borderWidth: 18,
    borderColor: C.orange,
    borderRightColor:
      "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  chartInner: {
    justifyContent: "center",
    alignItems: "center",
  },

  chartText: {
    fontSize: 24,
    fontWeight: "900",
    color: C.orange,
  },

  chartSub: {
    fontSize: 12,
    color: C.muted,
    marginTop: 2,
  },

  legendWrap: {
    flex: 1,
    marginLeft: 20,
    gap: 18,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 20,
  },

  legendTitle: {
    fontSize: 12,
    color: C.muted,
  },

  legendAmount: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    color: C.text,
  },

  detailCard: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: C.primary,
  },

  detailHeader: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  detailRow: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    paddingVertical: 8,
  },

  detailKey: {
    color: C.muted,
    fontSize: 13,
  },

  detailValue: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 8,
  },

  transactionCard: {
    flexDirection: "row",
    justifyContent:
      "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor:
      "#F1F5F9",
  },

  selectedCard: {
    backgroundColor:
      "#EFF6FF",
    borderRadius: 18,
    paddingHorizontal: 10,
  },

  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor:
      "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  orderId: {
    fontSize: 14,
    fontWeight: "800",
    color: C.text,
  },

  productName: {
    marginTop: 4,
    fontSize: 12,
    color: C.primary,
    fontWeight: "700",
  },

  customerText: {
    marginTop: 3,
    fontSize: 11,
    color: C.muted,
  },

  dateText: {
    marginTop: 3,
    fontSize: 10,
    color: "#94A3B8",
  },

  transactionRight: {
    alignItems: "flex-end",
    gap: 8,
  },

  amountText: {
    fontSize: 15,
    fontWeight: "800",
    color: C.green,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },

  emptyWrap: {
    paddingVertical: 50,
    alignItems: "center",
  },

  emptyText: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: C.muted,
  },
});
