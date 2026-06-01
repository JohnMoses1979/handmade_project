import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useShop } from "../../context/ShopContext";
import { showAlert } from "../../utils/showAlert";
import { getSellerPayoutSummaryAPI, withdrawSellerPayoutAPI } from "../../api/paymentApi";

const C = {
  primary: "#0e3243",
  primaryDark: "#0e3243",
  white: "#FFFFFF",
  bg: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  border: "#F3D3E2",
  soft: "#FFFFFF",
  green: "#16A34A",
  orange: "#F59E0B",
};

export default function SellerPayoutScreen({ navigation }) {
  const { currentSeller, cleanPrice, formatPrice, saveSellerProfile } = useShop();
  const [amount, setAmount] = useState("");
  const [requested, setRequested] = useState(false);
  const [summary, setSummary] = useState(null);
  const [savingBankDetails, setSavingBankDetails] = useState(false);
  const [bankHolderName, setBankHolderName] = useState(currentSeller?.bankAccountHolderName || "");
  const [bankName, setBankName] = useState(currentSeller?.bankName || "");
  const [bankAccountNumber, setBankAccountNumber] = useState(currentSeller?.bankAccountNumber || "");
  const [bankIfscCode, setBankIfscCode] = useState(currentSeller?.bankIfscCode || "");

  useEffect(() => {
    setBankHolderName(currentSeller?.bankAccountHolderName || "");
    setBankName(currentSeller?.bankName || "");
    setBankAccountNumber(currentSeller?.bankAccountNumber || "");
    setBankIfscCode(currentSeller?.bankIfscCode || "");
  }, [currentSeller]);

  useEffect(() => {
    let mounted = true;

    const loadSummary = async () => {
      if (!currentSeller?.id) return;
      const result = await getSellerPayoutSummaryAPI(currentSeller.id);
      if (mounted && result?.success) {
        setSummary(result);
      }
    };

    loadSummary();
    return () => {
      mounted = false;
    };
  }, [currentSeller]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const refreshSummary = async () => {
        if (!currentSeller?.id) return;
        const result = await getSellerPayoutSummaryAPI(currentSeller.id);
        if (mounted && result?.success) {
          setSummary(result);
        }
      };

      refreshSummary();

      return () => {
        mounted = false;
      };
    }, [currentSeller?.id])
  );

  const payoutHistory = useMemo(() => {
    return Array.isArray(summary?.customerPayments)
      ? summary.customerPayments.map((item, index) => {
          const paidAmount = cleanPrice(item.amount ?? 0);
          return {
            id: item.id || `PAY${index + 1}`,
            productName: item.customerName || "Customer",
            amount: formatPrice ? formatPrice(paidAmount) : `Rs ${paidAmount.toFixed(0)}`,
            amountNumber: paidAmount,
            date: item.createdAt
              ? `Paid on ${new Date(item.createdAt).toLocaleDateString("en-IN")}`
              : "Paid today",
            status: item.status || "Paid",
          };
        })
      : [];
  }, [summary, cleanPrice, formatPrice]);

  const availableBalance = cleanPrice(summary?.availableBalance ?? 0);
  const refundedAmount = cleanPrice(summary?.refundedAmount ?? 0);
  const netEarnings = cleanPrice(summary?.netEarnings ?? availableBalance);
  const hasBankDetails = Boolean(
    String(currentSeller?.bankAccountHolderName || "").trim() &&
    String(currentSeller?.bankAccountNumber || "").trim() &&
    String(currentSeller?.bankIfscCode || "").trim()
  );

  const canWithdraw = useMemo(() => {
    const n = Number(amount);
    return n > 0 && n <= availableBalance && hasBankDetails;
  }, [amount, availableBalance, hasBankDetails]);

  const saveBankDetails = async () => {
    const holder = String(bankHolderName || "").trim();
    const account = String(bankAccountNumber || "").trim();
    const ifsc = String(bankIfscCode || "").trim();

    if (!holder || !account || !ifsc) {
      showAlert("Missing details", "Please enter account holder name, account number and IFSC.");
      return;
    }

    try {
      setSavingBankDetails(true);
      await saveSellerProfile({
        bankAccountHolderName: holder,
        bankName: String(bankName || "").trim(),
        bankAccountNumber: account,
        bankIfscCode: ifsc.toUpperCase(),
      });
      showAlert("Saved", "Bank details updated successfully.");
    } catch (error) {
      showAlert("Unable to save", error?.message || "Please try again.");
    } finally {
      setSavingBankDetails(false);
    }
  };

  const withdraw = async () => {
    if (!hasBankDetails) {
      showAlert("Bank details needed", "Save your bank account details first to withdraw with Razorpay.");
      return;
    }
    if (!canWithdraw) return;
    const result = await withdrawSellerPayoutAPI({ sellerId: currentSeller?.id, amount: Number(amount) });
    if (!result?.success) {
      showAlert("Withdraw failed", result?.message || "Unable to create payout.");
      return;
    }

    setRequested(true);
    setAmount("");
    const refreshed = await getSellerPayoutSummaryAPI(currentSeller?.id);
    if (refreshed?.success) {
      setSummary(refreshed);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={C.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payouts</Text>

        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[C.primaryDark, C.primary]}
          style={styles.balanceCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View>
            <Text style={styles.balanceLabel}>Net amount available</Text>
            <Text style={styles.balanceValue}>
              {formatPrice ? formatPrice(availableBalance) : `Rs ${availableBalance.toFixed(0)}`}
            </Text>
            <Text style={styles.balanceSub}>Refunds are already deducted from this balance</Text>
          </View>

          <View style={styles.walletBox}>
            <Ionicons name="wallet" size={34} color={C.primary} />
          </View>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Withdraw Amount</Text>

          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor="#A1A1AA"
            keyboardType="number-pad"
            style={styles.input}
          />

          {requested && (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={18} color={C.green} />
              <Text style={styles.successText}>Razorpay withdrawal request submitted.</Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.85}
            disabled={!canWithdraw}
            onPress={withdraw}
            style={[styles.withdrawBtn, !canWithdraw && { opacity: 0.45 }]}
          >
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>

          {!hasBankDetails ? (
            <Text style={styles.warningText}>
              Save your bank details above to enable Razorpay withdrawal.
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Refund Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Refunds processed</Text>
            <Text style={styles.summaryValue}>
              {formatPrice ? formatPrice(refundedAmount) : `Rs ${refundedAmount.toFixed(0)}`}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Net earnings</Text>
            <Text style={styles.summaryValue}>
              {formatPrice ? formatPrice(netEarnings) : `Rs ${netEarnings.toFixed(0)}`}
            </Text>
          </View>
          <Text style={styles.warningText}>
            When a Razorpay refund is credited, seller payout balance decreases automatically.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Bank Details</Text>

          <TextInput
            value={bankHolderName}
            onChangeText={setBankHolderName}
            placeholder="Account holder name"
            placeholderTextColor="#A1A1AA"
            style={styles.input}
          />

          <TextInput
            value={bankName}
            onChangeText={setBankName}
            placeholder="Bank name"
            placeholderTextColor="#A1A1AA"
            style={[styles.input, { marginTop: 10 }]}
          />

          <TextInput
            value={bankAccountNumber}
            onChangeText={setBankAccountNumber}
            placeholder="Account number"
            placeholderTextColor="#A1A1AA"
            keyboardType="number-pad"
            style={[styles.input, { marginTop: 10 }]}
          />

          <TextInput
            value={bankIfscCode}
            onChangeText={(value) => setBankIfscCode(String(value || "").toUpperCase())}
            placeholder="IFSC code"
            placeholderTextColor="#A1A1AA"
            autoCapitalize="characters"
            style={[styles.input, { marginTop: 10 }]}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={saveBankDetails}
            disabled={savingBankDetails}
            style={[styles.withdrawBtn, { marginTop: 14 }, savingBankDetails && { opacity: 0.6 }]}
          >
            <Text style={styles.withdrawText}>
              {savingBankDetails ? "Saving..." : "Save Bank Details"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.bankHint}>
            These details are used by Razorpay to create the payout fund account.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Paid Listing Fees</Text>

          {payoutHistory.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Ionicons name="wallet-outline" size={42} color={C.muted} />
              <Text style={styles.emptyText}>No paid listing fees yet.</Text>
            </View>
          ) : payoutHistory.map((item) => (
            <View key={item.id} style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Ionicons name="cash-outline" size={22} color={C.primary} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.payoutId}>{item.id}</Text>
                <Text style={styles.payoutProduct}>{item.productName}</Text>
                <Text style={styles.payoutDate}>{item.date}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.amount}>{item.amount}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
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
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  balanceCard: {
    borderRadius: 24,
    padding: 22,
    minHeight: 150,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#FCE7F3",
    fontSize: 13,
    fontWeight: "800",
  },
  balanceValue: {
    color: C.white,
    fontSize: 31,
    fontWeight: "900",
    marginTop: 8,
  },
  balanceSub: {
    color: "#FCE7F3",
    marginTop: 6,
    fontWeight: "700",
  },
  walletBox: {
    width: 74,
    height: 74,
    borderRadius: 22,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: C.text,
    marginBottom: 14,
  },
  input: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1.4,
    borderColor: C.border,
    paddingHorizontal: 14,
    color: C.text,
    fontSize: 15,
    fontWeight: "700",
  },
  withdrawBtn: {
    height: 52,
    borderRadius: 16,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  withdrawText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "900",
  },
  successBox: {
    marginTop: 12,
    backgroundColor: "#ECFDF5",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  successText: {
    marginLeft: 8,
    color: C.green,
    fontWeight: "800",
  },
  warningText: {
    color: C.orange,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    fontWeight: "700",
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  summaryLabel: {
    color: C.muted,
    fontSize: 12.5,
    fontWeight: "600",
  },
  summaryValue: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
  },
  bankHint: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    fontWeight: "600",
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F8EAF1",
  },
  historyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.soft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  payoutId: {
    color: C.text,
    fontSize: 13,
    fontWeight: "900",
  },
  payoutProduct: {
    color: C.text,
    fontSize: 12,
    marginTop: 3,
    fontWeight: "700",
  },
  payoutDate: {
    color: C.muted,
    fontSize: 12,
    marginTop: 3,
    fontWeight: "600",
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 28,
  },
  emptyText: {
    color: C.muted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 10,
  },
  amount: {
    color: C.text,
    fontSize: 13,
    fontWeight: "900",
  },
  statusPill: {
    marginTop: 6,
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    color: C.green,
    fontSize: 10,
    fontWeight: "900",
  },
});
