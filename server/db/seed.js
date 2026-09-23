const bcrypt = require('bcryptjs');
const db = require('./database');

function seedDatabase() {
  console.log('Seeding CampusBite Database...');

  // 1. Seed Users (if not exists)
  const existingUsers = db.all('SELECT COUNT(*) as count FROM users');
  if (existingUsers[0].count === 0) {
    const adminPassword = bcrypt.hashSync('admin123', 10);
    const studentPassword = bcrypt.hashSync('student123', 10);

    db.run(
      `INSERT INTO users (name, student_id, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      ['Canteen Manager', 'STAFF-01', 'admin@campusbite.com', adminPassword, 'admin']
    );

    db.run(
      `INSERT INTO users (name, student_id, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      ['Rahul Sharma', 'CS2024-042', 'rahul@campus.edu', studentPassword, 'student']
    );

    db.run(
      `INSERT INTO users (name, student_id, email, password, role) VALUES (?, ?, ?, ?, ?)`,
      ['Priya Patel', 'EC2024-118', 'priya@campus.edu', studentPassword, 'student']
    );

    console.log('✔ Users seeded (Admin: admin@campusbite.com, Students: rahul@campus.edu, priya@campus.edu)');
  }

  // 2. Seed Food Items (if not exists)
  const existingFood = db.all('SELECT COUNT(*) as count FROM food_items');
  if (existingFood[0].count === 0) {
    const foodItems = [
      {
        name: 'Idli (2 pcs) with Sambar & Chutney',
        category: 'Breakfast',
        description: 'Steamed fluffy rice and lentil cakes served with piping hot flavorful sambar and fresh coconut chutney.',
        price: 30,
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 8
      },
      {
        name: 'Crispy Butter Masala Dosa',
        category: 'Breakfast',
        description: 'Golden crispy rice crepe smeared with fragrant spiced potato filling and rich butter, served with 2 chutneys.',
        price: 40,
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 12
      },
      {
        name: 'Special South Indian Veg Meals',
        category: 'Meals',
        description: 'Wholesome campus thali with steamed rice, sambar, rasam, curd, 2 veg curries, papad, and dessert.',
        price: 80,
        image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 10
      },
      {
        name: 'Veg Schezwan Fried Rice',
        category: 'Meals',
        description: 'Wok-tossed basmati rice with crunchy carrots, cabbage, bell peppers, and zesty Schezwan sauce.',
        price: 80,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 15
      },
      {
        name: 'Crispy Punjabi Samosa (2 pcs)',
        category: 'Snacks',
        description: 'Flaky pastry stuffed with spiced potatoes and peas, served with sweet tamarind and mint green chutney.',
        price: 20,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 5
      },
      {
        name: 'Grilled Cheese Veggie Sandwich',
        category: 'Snacks',
        description: 'Toasted multi-grain bread layered with cucumbers, tomatoes, bell peppers, mint spread, and melted cheese.',
        price: 50,
        image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 10
      },
      {
        name: 'Fresh Orange & Sweet Lime Juice',
        category: 'Beverages',
        description: 'Freshly squeezed chilled citrus juice packed with natural vitamin C, served with or without mint.',
        price: 40,
        image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 5
      },
      {
        name: 'Special Masala Chai',
        category: 'Beverages',
        description: 'Traditional Indian milk tea brewed with crushed ginger, green cardamom, and aromatic spices.',
        price: 15,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 5
      },
      {
        name: 'South Indian Filter Coffee',
        category: 'Beverages',
        description: 'Frothy and strong traditional filter coffee made from freshly roasted chicory blend.',
        price: 20,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 5
      },
      {
        name: 'Crispy Veg Burger & Fries',
        category: 'Fast Food',
        description: 'Crispy herb potato patty topped with lettuce, tomato, onions, and creamy secret burger sauce with side fries.',
        price: 70,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 12
      },
      {
        name: 'Paneer Butter Masala with 2 Parottas',
        category: 'Meals',
        description: 'Cottage cheese cubes simmered in rich buttery tomato cashew gravy with flaky Kerala parottas.',
        price: 110,
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 15
      },
      {
        name: 'Hyderabadi Chicken Biryani',
        category: 'Meals',
        description: 'Aromatic dum basmati rice slow-cooked with succulent spiced chicken cuts, boiled egg, and mirchi ka salan.',
        price: 130,
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
        is_veg: 0,
        availability: 1,
        preparation_time: 12
      },
      {
        name: 'Crispy Medu Vada (2 pcs)',
        category: 'Breakfast',
        description: 'Crunchy golden fried lentil donuts with crushed peppercorns and curry leaves, served with sambar.',
        price: 35,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 8
      },
      {
        name: 'Chole Bhature (2 pcs)',
        category: 'Breakfast',
        description: 'Puffy deep-fried bhaturas served with robustly spiced Punjabi chickpea masala, pickle, and onions.',
        price: 75,
        image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 12
      },
      {
        name: 'Thick Cold Coffee with Chocolate',
        category: 'Beverages',
        description: 'Chilled creamy blended coffee topped with chocolate syrup drizzle and a scoop of vanilla ice cream.',
        price: 50,
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
        is_veg: 1,
        availability: 1,
        preparation_time: 6
      }
    ];

    const insertFood = db.db.prepare(
      `INSERT INTO food_items (name, category, description, price, image, is_veg, availability, preparation_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );

    foodItems.forEach(item => {
      insertFood.run(item.name, item.category, item.description, item.price, item.image, item.is_veg, item.availability, item.preparation_time);
    });

    console.log(`✔ ${foodItems.length} Food items seeded`);
  }

  // 3. Seed Realistic Sample Orders (if none exist)
  const existingOrders = db.all('SELECT COUNT(*) as count FROM orders');
  if (existingOrders[0].count === 0) {
    const student1 = db.get("SELECT * FROM users WHERE email = 'rahul@campus.edu'");
    const student2 = db.get("SELECT * FROM users WHERE email = 'priya@campus.edu'");

    const sampleOrders = [
      {
        order_number: 'CB-1041',
        user_id: student1 ? student1.id : 2,
        student_name: 'Rahul Sharma',
        student_id: 'CS2024-042',
        total_amount: 110,
        payment_method: 'UPI',
        payment_status: 'Paid',
        order_status: 'Preparing',
        transaction_id: 'UPI-982341904',
        pickup_location: 'Main Canteen Counter 1',
        estimated_time: '8 mins',
        special_instructions: 'Extra sambar please',
        items: [
          { food_id: 1, food_name: 'Idli (2 pcs) with Sambar & Chutney', price: 30, quantity: 2 },
          { food_id: 8, food_name: 'Special Masala Chai', price: 15, quantity: 2 },
          { food_id: 5, food_name: 'Crispy Punjabi Samosa (2 pcs)', price: 20, quantity: 1 }
        ]
      },
      {
        order_number: 'CB-1042',
        user_id: student2 ? student2.id : 3,
        student_name: 'Priya Patel',
        student_id: 'EC2024-118',
        total_amount: 80,
        payment_method: 'Card',
        payment_status: 'Paid',
        order_status: 'Ready for Pickup',
        transaction_id: 'TXN-CARD-44912',
        pickup_location: 'Snack Counter 2',
        estimated_time: 'Ready Now',
        special_instructions: 'Pack separately',
        items: [
          { food_id: 6, food_name: 'Grilled Cheese Veggie Sandwich', price: 50, quantity: 1 },
          { food_id: 1, food_name: 'Idli (2 pcs) with Sambar & Chutney', price: 30, quantity: 1 }
        ]
      },
      {
        order_number: 'CB-1040',
        user_id: student1 ? student1.id : 2,
        student_name: 'Rahul Sharma',
        student_id: 'CS2024-042',
        total_amount: 170,
        payment_method: 'UPI',
        payment_status: 'Paid',
        order_status: 'Completed',
        transaction_id: 'UPI-981249102',
        pickup_location: 'Main Canteen Counter 1',
        estimated_time: 'Completed',
        special_instructions: '',
        items: [
          { food_id: 12, food_name: 'Hyderabadi Chicken Biryani', price: 130, quantity: 1 },
          { food_id: 7, food_name: 'Fresh Orange & Sweet Lime Juice', price: 40, quantity: 1 }
        ]
      },
      {
        order_number: 'CB-1043',
        user_id: student2 ? student2.id : 3,
        student_name: 'Priya Patel',
        student_id: 'EC2024-118',
        total_amount: 40,
        payment_method: 'Cash on Pickup',
        payment_status: 'Pending',
        order_status: 'Order Received',
        transaction_id: 'CASH-PENDING',
        pickup_location: 'Beverage Counter',
        estimated_time: '12 mins',
        special_instructions: 'Less sugar in coffee',
        items: [
          { food_id: 9, food_name: 'South Indian Filter Coffee', price: 20, quantity: 2 }
        ]
      }
    ];

    sampleOrders.forEach(ord => {
      const res = db.run(
        `INSERT INTO orders (order_number, user_id, student_name, student_id, total_amount, payment_method, payment_status, order_status, transaction_id, pickup_location, estimated_time, special_instructions)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [ord.order_number, ord.user_id, ord.student_name, ord.student_id, ord.total_amount, ord.payment_method, ord.payment_status, ord.order_status, ord.transaction_id, ord.pickup_location, ord.estimated_time, ord.special_instructions]
      );

      const orderId = res.lastInsertRowid;
      ord.items.forEach(itm => {
        db.run(
          `INSERT INTO order_items (order_id, food_id, food_name, price, quantity) VALUES (?, ?, ?, ?, ?)`,
          [orderId, itm.food_id, itm.food_name, itm.price, itm.quantity]
        );
      });
    });

    console.log(`✔ Sample student orders seeded for realistic admin demo`);
  }

  console.log('Database initialization & seeding complete!');
}

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase();
}
