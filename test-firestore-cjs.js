const { ChartDataService } = require('./src/services/chartDataService.js')

async function testFirestore() {
  try {
    console.log('🔄 Testing Firestore connection...')
    const data = await ChartDataService.getHealthMetrics()
    
    if (data.length === 0) {
      console.log('⚠️  No data found')
    } else {
      console.log(`✅ Found ${data.length} records`)
      console.log('Sample:', JSON.stringify(data[0], null, 2))
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testFirestore()