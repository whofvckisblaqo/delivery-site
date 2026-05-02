const mongoose = require('mongoose')

const MONGODB_URI = 'mongodb+srv://fastdrop:fastdrop2026@cluster0.axvmyvt.mongodb.net/fastdropexpress?retryWrites=true&w=majority&appName=Cluster0'

async function seed() {
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')

  // Clear all collections
  await mongoose.connection.collection('admins').deleteMany({})
  await mongoose.connection.collection('orders').deleteMany({})
  await mongoose.connection.collection('trackings').deleteMany({})
  await mongoose.connection.collection('customers').deleteMany({})
  await mongoose.connection.collection('messages').deleteMany({})

  // Create admin
  await mongoose.connection.collection('admins').insertOne({
    username:  'admin',
    password:  'fastdrop2024',
    createdAt: new Date(),
  })

  console.log('✅ Admin created')
  console.log('✅ Database seeded!')
  await mongoose.disconnect()
}

seed().catch(console.error)