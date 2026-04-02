const products = [
  // Women Fashion
  {
    id: 1,
    name: 'Floral Dress',
    category: 'Women Fashion',
    price: 49.99,
    rating: 4.5,
    description: 'A beautiful floral dress perfect for summer.',
    size: ['S', 'M', 'L'],
    color: ['Red', 'Blue', 'Green'],
    image: 'https://example.com/floral-dress.jpg'
  },
  {
    id: 2,
    name: 'Summer Blouse',
    category: 'Women Fashion',
    price: 39.99,
    rating: 4.0,
    description: 'Light summer blouse for casual outings.',
    size: ['S', 'M', 'L', 'XL'],
    color: ['White', 'Pink'],
    image: 'https://example.com/summer-blouse.jpg'
  },
  {
    id: 3,
    name: 'Maxi Skirt',
    category: 'Women Fashion',
    price: 45.50,
    rating: 4.2,
    description: 'Long maxi skirt, perfect for beach days.',
    size: ['M', 'L'],
    color: ['Black', 'Yellow'],
    image: 'https://example.com/maxi-skirt.jpg'
  },
  {
    id: 4,
    name: 'Casual T-Shirt',
    category: 'Women Fashion',
    price: 25.00,
    rating: 4.7,
    description: 'Comfortable t-shirt for everyday wear.',
    size: ['XS', 'S', 'M'],
    color: ['Gray', 'Blue'],
    image: 'https://example.com/casual-tee.jpg'
  },
  {
    id: 5,
    name: 'Evening Gown',
    category: 'Women Fashion',
    price: 130.00,
    rating: 4.9,
    description: 'Elegant evening gown for special occasions.',
    size: ['S', 'M', 'L'],
    color: ['Red', 'Black'],
    image: 'https://example.com/evening-gown.jpg'
  },
  {
    id: 6,
    name: 'Denim Jacket',
    category: 'Women Fashion',
    price: 60.00,
    rating: 4.3,
    description: 'Stylish denim jacket for cool weather.',
    size: ['XS', 'S', 'M', 'L'],
    color: ['Blue', 'Black'],
    image: 'https://example.com/denim-jacket.jpg'
  },
  {
    id: 7,
    name: 'Leather Handbag',
    category: 'Women Fashion',
    price: 85.00,
    rating: 4.6,
    description: 'Fashionable leather handbag.',
    size: 'One Size',
    color: ['Brown', 'Black'],
    image: 'https://example.com/leather-handbag.jpg'
  },
  {
    id: 8,
    name: 'Chunky Sweater',
    category: 'Women Fashion',
    price: 55.00,
    rating: 4.4,
    description: 'Cozy chunky sweater for fall.',
    size: ['M', 'L'],
    color: ['Gray', 'Cream'],
    image: 'https://example.com/chunky-sweater.jpg'
  },
  
  // Kids Fashion
  {
    id: 9,
    name: 'Kids T-Shirt',
    category: 'Kids Fashion',
    price: 15.99,
    rating: 4.5,
    description: 'Fun t-shirt for kids.',
    size: ['S', 'M', 'L'],
    color: ['Red', 'Blue'],
    image: 'https://example.com/kids-tshirt.jpg'
  },
  {
    id: 10,
    name: 'Kids Jeans',
    category: 'Kids Fashion',
    price: 25.50,
    rating: 4.1,
    description: 'Comfortable jeans for kids.',
    size: ['S', 'M'],
    color: ['Blue'],
    image: 'https://example.com/kids-jeans.jpg'
  },
  {
    id: 11,
    name: 'Kids Hoodie',
    category: 'Kids Fashion',
    price: 35.00,
    rating: 4.6,
    description: 'Warm hoodie for chilly days.',
    size: ['M', 'L'],
    color: ['Green', 'Yellow'],
    image: 'https://example.com/kids-hoodie.jpg'
  },
  {
    id: 12,
    name: 'Kids Shorts',
    category: 'Kids Fashion',
    price: 18.00,
    rating: 4.4,
    description: 'Cool shorts for summer.',
    size: ['M', 'L'],
    color: ['Gray', 'Blue'],
    image: 'https://example.com/kids-shorts.jpg'
  },
  {
    id: 13,
    name: 'Kids Cap',
    category: 'Kids Fashion',
    price: 12.00,
    rating: 4.7,
    description: 'Stylish cap for kids.',
    size: 'One Size',
    color: ['Black', 'Red'],
    image: 'https://example.com/kids-cap.jpg'
  },
  {
    id: 14,
    name: 'Kids Sneakers',
    category: 'Kids Fashion',
    price: 40.00,
    rating: 4.5,
    description: 'Comfortable sneakers for kids.',
    size: ['S', 'M'],
    color: ['Blue', 'White'],
    image: 'https://example.com/kids-sneakers.jpg'
  },
  
  // Shoes
  {
    id: 15,
    name: 'Running Shoes',
    category: 'Shoes',
    price: 75.00,
    rating: 4.8,
    description: 'High-performance running shoes.',
    size: [6, 7, 8, 9, 10],
    color: ['Black', 'Gray'],
    image: 'https://example.com/running-shoes.jpg'
  },
  {
    id: 16,
    name: 'Stylish Sandals',
    category: 'Shoes',
    price: 50.00,
    rating: 4.3,
    description: 'Stylish sandals for casual wear.',
    size: [7, 8, 9],
    color: ['Brown', 'Black'],
    image: 'https://example.com/stylish-sandals.jpg'
  },
  {
    id: 17,
    name: 'Sneakers',
    category: 'Shoes',
    price: 60.00,
    rating: 4.6,
    description: 'Versatile sneakers for everyday use.',
    size: [6, 7, 8, 10],
    color: ['White', 'Blue'],
    image: 'https://example.com/sneakers.jpg'
  },
  {
    id: 18,
    name: 'Formal Shoes',
    category: 'Shoes',
    price: 85.00,
    rating: 4.2,
    description: 'Smart formal shoes for professional occasions.',
    size: [8, 9, 10],
    color: ['Black', 'Brown'],
    image: 'https://example.com/formal-shoes.jpg'
  },
  {
    id: 19,
    name: 'Boots',
    category: 'Shoes',
    price: 90.00,
    rating: 4.4,
    description: 'Durable boots for outdoor activities.',
    size: [7, 8, 9],
    color: ['Brown', 'Black'],
    image: 'https://example.com/boots.jpg'
  },
  {
    id: 20,
    name: 'Slippers',
    category: 'Shoes',
    price: 25.00,
    rating: 4.3,
    description: 'Comfortable slippers for home.',
    size: [7, 8, 9],
    color: ['Black', 'Gray'],
    image: 'https://example.com/slippers.jpg'
  },
  
  // Men Fashion
  {
    id: 21,
    name: 'Casual Shirt',
    category: 'Men Fashion',
    price: 40.00,
    rating: 4.1,
    description: 'Stylish casual shirt for men.',
    size: ['M', 'L', 'XL'],
    color: ['Blue', 'Green'],
    image: 'https://example.com/casual-shirt.jpg'
  },
  {
    id: 22,
    name: 'Formal Suit',
    category: 'Men Fashion',
    price: 200.00,
    rating: 4.8,
    description: 'Elegant formal suit for business occasions.',
    size: ['M', 'L'],
    color: ['Black', 'Gray'],
    image: 'https://example.com/formal-suit.jpg'
  },
  {
    id: 23,
    name: 'Sports Jacket',
    category: 'Men Fashion',
    price: 75.00,
    rating: 4.6,
    description: 'Stylish sports jacket for men's casual outings.',
    size: ['M', 'L'],
    color: ['Navy', 'Gray'],
    image: 'https://example.com/sports-jacket.jpg'
  },
  {
    id: 24,
    name: 'Denim Jeans',
    category: 'Men Fashion',
    price: 55.00,
    rating: 4.5,
    description: 'Comfortable denim jeans.',
    size: ['M', 'L'],
    color: ['Blue', 'Black'],
    image: 'https://example.com/denim-jeans.jpg'
  },
  {
    id: 25,
    name: 'Cotton T-Shirt',
    category: 'Men Fashion',
    price: 30.00,
    rating: 4.2,
    description: 'Basic cotton t-shirt for men.',
    size: ['M', 'L', 'XL'],
    color: ['White', 'Black'],
    image: 'https://example.com/cotton-tshirt.jpg'
  },
  
  // Men Accessories
  {
    id: 26,
    name: 'Leather Belt',
    category: 'Men Accessories',
    price: 29.99,
    rating: 4.4,
    description: 'Stylish leather belt.',
    size: 'One Size',
    color: ['Black', 'Brown'],
    image: 'https://example.com/leather-belt.jpg'
  },
  {
    id: 27,
    name: 'Wrist Watch',
    category: 'Men Accessories',
    price: 199.99,
    rating: 4.8,
    description: 'Elegant wrist watch.',
    size: 'One Size',
    color: ['Silver', 'Gold'],
    image: 'https://example.com/wrist-watch.jpg'
  },
  {
    id: 28,
    name: 'Sunglasses',
    category: 'Men Accessories',
    price: 49.99,
    rating: 4.5,
    description: 'Stylish sunglasses.',
    size: 'One Size',
    color: ['Black', 'Brown'],
    image: 'https://example.com/sunglasses.jpg'
  },  
  
  // Women Accessories
  {
    id: 29,
    name: 'Earrings',
    category: 'Women Accessories',
    price: 25.00,
    rating: 4.7,
    description: 'Elegant earrings for special occasions.',
    size: 'One Size',
    color: ['Gold', 'Silver'],
    image: 'https://example.com/earrings.jpg'
  },
  {
    id: 30,
    name: 'Necklace',
    category: 'Women Accessories',
    price: 40.00,
    rating: 4.5,
    description: 'Beautiful necklace to complement your outfit.',
    size: 'One Size',
    color: ['Gold', 'Silver'],
    image: 'https://example.com/necklace.jpg'
  }
];

export default products;