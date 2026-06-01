export const categories = [
  {
    id: "1",
    name: "Sweets",
    image: "https://images.unsplash.com/photo-1605197183305-6a4bb6b09b49?w=600",
  },
  {
    id: "2",
    name: "Rakhi",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600",
  },
  {
    id: "3",
    name: "Ganesh Idols",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600",
  },
  {
    id: "4",
    name: "Pickles",
    image: "https://images.unsplash.com/photo-1609501676725-7186f7340d4f?w=600",
  },
];

export const products = [
  {
    id: "1",
    name: "Traditional Rakhi",
    price: 150,
    category: "Rakhi",
    seller: "Priya Creations",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=600",
    description: "Beautiful handmade rakhi made with beads and traditional materials.",
  },
  {
    id: "2",
    name: "Designer Rakhi",
    price: 200,
    category: "Rakhi",
    seller: "Artistic Hands",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
    description: "Premium designer rakhi for Raksha Bandhan festival.",
  },
  {
    id: "3",
    name: "Traditional Ladoo",
    price: 250,
    category: "Sweets",
    seller: "Sweet Delights",
    image: "https://images.unsplash.com/photo-1605197183305-6a4bb6b09b49?w=600",
    description: "Fresh homemade ladoos prepared with pure ingredients.",
  },
  {
    id: "4",
    name: "Mango Pickle",
    price: 180,
    category: "Pickles",
    seller: "Pickle House",
    image: "https://images.unsplash.com/photo-1609501676725-7186f7340d4f?w=600",
    description: "Traditional spicy mango pickle made at home.",
  },
  {
    id: "5",
    name: "Ganesh Idol",
    price: 500,
    category: "Ganesh Idols",
    seller: "Artistic Hands",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600",
    description: "Eco friendly handmade Ganesh idol for festivals.",
  },
];

export const orders = [
  { id: "#ORD12345", customer: "John Doe", amount: 350, status: "Delivered", date: "12 May 2024" },
  { id: "#ORD12344", customer: "Priya Singh", amount: 550, status: "Shipped", date: "11 May 2024" },
  { id: "#ORD12343", customer: "Rahul Verma", amount: 250, status: "Confirmed", date: "10 May 2024" },
];

export const users = [
  { id: "1", name: "John Doe", email: "john@gmail.com", status: "Active" },
  { id: "2", name: "Priya Singh", email: "priya@gmail.com", status: "Active" },
  { id: "3", name: "Rahul Verma", email: "rahul@gmail.com", status: "Inactive" },
];

export const sellers = [
  { id: "1", name: "Priya Creations", email: "priya@seller.com", status: "Active" },
  { id: "2", name: "Sweet Delights", email: "sweet@seller.com", status: "Active" },
  { id: "3", name: "Pickle House", email: "pickle@seller.com", status: "Pending" },
];