import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD6Z5RlmZ4xw1sKH1WNYZPxcgE3VnhxmNA",
  authDomain: "mentalhealth-62e7e.firebaseapp.com",
  projectId: "mentalhealth-62e7e",
  storageBucket: "mentalhealth-62e7e.firebasestorage.app",
  messagingSenderId: "943207121781",
  appId: "1:943207121781:web:b380a2520c10816d20893c"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

class TestChartDataService {
  static async getHealthMetrics() {
    try {
      console.log('🔄 Fetching health metrics from Firestore...')
      const q = query(collection(db, 'Mentalexercise'), orderBy('data', 'desc'))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data()
        console.log('Document data:', docData)
        return {
          id: doc.id,
          date: docData.data ? docData.data.toDate() : new Date(),
          mood: docData.Mood,
          exerciseTime: docData['exercise time/h'] || 0,
          sleepTime: docData['sleep time/h'] || 0,
          value: docData['sleep time/h'] || 0
        }
      })
      console.log('Total documents fetched:', data.length)
      return data
    } catch (error) {
      console.error('Error fetching health metrics:', error)
      return []
    }
  }
}

async function testFirestore() {
  try {
    console.log('🚀 Starting Firestore connection test...')
    console.log('📊 Fetching data from Mentalexercise collection...')

    const data = await TestChartDataService.getHealthMetrics()

    if (data.length === 0) {
      console.log('⚠️  No data found in collection')
      console.log('   Please check:')
      console.log('   - Firebase configuration')
      console.log('   - Collection name: Mentalexercise')
      console.log('   - Data exists in Firestore')
      console.log('   - Firestore rules allow read access')
    } else {
      console.log(`✅ Successfully fetched ${data.length} records`)
      console.log('📋 Sample data:')
      console.log(JSON.stringify(data.slice(0, 2), null, 2))

      console.log('\n📈 Data summary:')
      data.forEach((record, index) => {
        console.log(`   Record ${index + 1}: Date=${record.date?.toLocaleDateString()}, Mood=${record.mood}, Sleep=${record.sleepTime}h, Exercise=${record.exerciseTime}h`)
      })
    }
  } catch (error) {
    console.error('❌ Error testing Firestore:', error.message)
    console.error('   Full error:', error)
  }
}

console.log('🚀 Starting Firestore connection test...')
testFirestore()
  .then(() => {
    console.log('\n✨ Test completed')
    // 在浏览器环境中优雅退出
    window.close()
  })
  .catch((error) => {
    console.error('💥 Test failed:', error)
    // 在浏览器环境中处理错误退出
    if (typeof window !== 'undefined') {
      window.close();
    }
  })
