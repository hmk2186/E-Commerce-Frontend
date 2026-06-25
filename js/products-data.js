// Mock product database for the frontend E-Commerce website
const products = [
  {
    id: 1,
    name: "Ultra-Sound Noise Cancelling Headphones",
    price: 199.99,
    rating: 4.8,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description: "Experience music like never before with our premium wireless headphones. Features active noise cancellation, 40-hour battery life, and ultra-comfortable memory foam earcups.",
    features: [
      "Hybrid Active Noise Cancellation (ANC)",
      "Up to 40 Hours of Playtime",
      "Hi-Res Audio Certified with Custom EQ",
      "Bluetooth 5.2 & Multipoint Connection",
      "Built-in Microphones for Crystal Clear Calls"
    ],
    stock: 12,
    badge: "Hot Deal"
  },
  {
    id: 2,
    name: "AeroSport Classic Leather Sneakers",
    price: 89.99,
    rating: 4.5,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    description: "Step out in style and comfort. These classic sneakers combine premium leather, breathable mesh, and a responsive cushioned sole for all-day support.",
    features: [
      "Genuine leather upper with suede details",
      "Cushioned EVA midsole for maximum comfort",
      "Durable rubber outsole with multi-surface traction",
      "Breathable lining keeps feet cool",
      "Lace-up closure for a secure fit"
    ],
    stock: 25,
    badge: "Best Seller"
  },
  {
    id: 3,
    name: "Vanguard Smartwatch Series 5",
    price: 249.99,
    rating: 4.7,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    description: "Stay connected, active, and healthy. Track your workouts, monitor heart rate, sleep quality, and receive calls/texts right on your wrist.",
    features: [
      "1.78-inch Always-on AMOLED Display",
      "24/7 Heart Rate & SpO2 Monitoring",
      "Built-in GPS and 15+ Sports Modes",
      "5ATM Water Resistant (up to 50m)",
      "Up to 7 Days Battery Life on a Single Charge"
    ],
    stock: 8,
    badge: "New"
  },
  {
    id: 4,
    name: "Urban Explorer Ergonomic Backpack",
    price: 59.99,
    rating: 4.4,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    description: "The ultimate backpack for daily commute or weekend adventures. Water-resistant material, padded laptop compartment, and multiple pockets for organization.",
    features: [
      "Durable, water-resistant 900D Nylon fabric",
      "Dedicated padded pocket fits up to 16\" laptops",
      "USB charging port design (power bank not included)",
      "Ergonomic padded shoulder straps & back support",
      "Hidden anti-theft pocket on the back"
    ],
    stock: 30,
    badge: ""
  },
  {
    id: 5,
    name: "Minimalist Wooden Base Desk Lamp",
    price: 45.00,
    rating: 4.6,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80",
    description: "Add a touch of warmth and modern design to your study or bedroom. Features an authentic wooden base, fabric shade, and dimmable LED bulb compatibility.",
    features: [
      "Natural solid ash wood base",
      "Premium linen fabric drum shade",
      "Compatible with dimmable E26 LED bulbs",
      "Rotary on/off switch on the cord",
      "Compact design suitable for bedside or study table"
    ],
    stock: 15,
    badge: ""
  },
  {
    id: 6,
    name: "Double-Walled Stainless Water Bottle",
    price: 24.99,
    rating: 4.9,
    category: "Fitness",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80",
    description: "Keep your drinks ice-cold for 24 hours or piping hot for 12 hours. Made of premium food-grade stainless steel with a leak-proof straw lid.",
    features: [
      "18/8 Food-grade stainless steel & BPA free",
      "Double-walled vacuum insulation technology",
      "Leak-proof cap with handle and built-in straw",
      "Sweat-free powder coating for easy grip",
      "Fits standard cup holders"
    ],
    stock: 50,
    badge: "Top Rated"
  },
  {
    id: 7,
    name: "AeroPro High-End Business Laptop 14\"",
    price: 999.99,
    rating: 4.9,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=600&auto=format&fit=crop&q=80",
    description: "Power your productivity with the AeroPro 14. Supercharged with a fast octa-core processor, stunning 2K display, and a sleek lightweight aluminum body.",
    features: [
      "Octa-Core High Performance Processor",
      "16GB LPDDR5 RAM & 512GB PCIe Gen4 SSD",
      "14-inch 2K (2240x1400) IPS Anti-glare Display",
      "Backlit Keyboard & Fingerprint Security Sensor",
      "Super Lightweight at only 1.2kg"
    ],
    stock: 5,
    badge: "Sale"
  },
  {
    id: 8,
    name: "Retro Style Polarized Sunglasses",
    price: 35.00,
    rating: 4.3,
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80",
    description: "Protect your eyes in style. These retro-inspired polarized sunglasses offer UV400 protection and a comfortable, lightweight frame for daily wear.",
    features: [
      "Polarized TAC lenses block 99% glare",
      "100% UV400 protection",
      "Sturdy metal reinforced hinges",
      "Comfortable integrated nose pads",
      "Comes with protective case and microfiber cloth"
    ],
    stock: 40,
    badge: ""
  },
  {
    id: 9,
    name: "Handcrafted Ceramic Coffee Mug Set",
    price: 29.99,
    rating: 4.7,
    category: "Home & Living",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    description: "A beautiful set of two handcrafted ceramic mugs. Features a unique reactive glaze finish, making each piece unique. Dishwasher and microwave safe.",
    features: [
      "Set of 2 ceramic mugs (14 oz capacity each)",
      "Reactive glaze finish creates beautiful organic patterns",
      "Ergonomic handle for a comfortable hold",
      "Microwave and dishwasher safe",
      "Lead-free and food-safe clay material"
    ],
    stock: 18,
    badge: ""
  }
];

// Helper functions for data management
const getProductById = (id) => products.find(p => p.id === parseInt(id));
const getProductsByCategory = (category) => products.filter(p => p.category.toLowerCase() === category.toLowerCase());
const getFeaturedProducts = () => products.slice(0, 4); // Take first 4 as featured
const getRelatedProducts = (id, category) => products.filter(p => p.category === category && p.id !== parseInt(id)).slice(0, 4);
const searchProducts = (query) => products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()));
