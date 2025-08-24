import { ChartDataService } from './src/services/chartDataService.js'

async function testFirestore() {
  try {
    console.log('🔄 Testing Firestore connection...')
    console.log('📊 Fetching data from Mentalexercise collection...')
    
    const data = await ChartDataService.getHealthMetrics()
    
    if (data.length === 0) {
      console.log('⚠️  No data found in collection')
      console.log('   Please check:')
      console.log('   - Firebase configuration')
      console.log('   - Collection name: Mentalexercise')
      console.log('   - Data exists in Firestore')
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
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Test failed:', error)
    process.exit(1)
  })