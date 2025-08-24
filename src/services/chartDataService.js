import { db } from '@/firebase/init'
import { collection, getDocs, onSnapshot, query, orderBy, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore'

export class ChartDataService {
  static async getHealthMetrics() {
    try {
      console.log('Fetching health metrics from Firestore...')
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

  static subscribeToHealthMetrics(callback) {
    console.log('Setting up real-time listener...')
    const q = query(collection(db, 'Mentalexercise'), orderBy('data', 'desc'))
    return onSnapshot(q, (querySnapshot) => {
      console.log('Real-time update received, documents:', querySnapshot.size)
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data()
        return {
          id: doc.id,
          date: docData.data ? docData.data.toDate() : new Date(),
          mood: docData.Mood,
          exerciseTime: docData['exercise time/h'] || 0,
          sleepTime: docData['sleep time/h'] || 0,
          value: docData['sleep time/h'] || 0
        }
      })
      callback(data)
    }, (error) => {
      console.error('Real-time listener error:', error)
    })
  }

  static async getSleepData() {
    try {
      console.log('Fetching sleep data from Firestore...')
      const q = query(collection(db, 'Mentalexercise'), orderBy('data', 'desc'))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data()
        return {
          id: doc.id,
          date: docData.data ? docData.data.toDate() : new Date(),
          value: docData['sleep time/h'] || 0
        }
      })
      console.log('Sleep data fetched:', data.length)
      return data
    } catch (error) {
      console.error('Error fetching sleep data:', error)
      return []
    }
  }

  static async getExerciseData() {
    try {
      console.log('Fetching exercise data from Firestore...')
      const q = query(collection(db, 'Mentalexercise'), orderBy('data', 'desc'))
      const querySnapshot = await getDocs(q)
      const data = querySnapshot.docs.map(doc => {
        const docData = doc.data()
        return {
          id: doc.id,
          date: docData.data ? docData.data.toDate() : new Date(),
          value: docData['exercise time/h'] || 0
        }
      })
      console.log('Exercise data fetched:', data.length)
      return data
    } catch (error) {
      console.error('Error fetching exercise data:', error)
      return []
    }
  }

  static async addHealthMetric(data) {
    try {
      console.log('Adding new health metric to Firestore...', data)
      const docRef = await addDoc(collection(db, 'Mentalexercise'), {
        data: Timestamp.fromDate(new Date(data.date)),
        Mood: data.mood,
        'exercise time/h': parseFloat(data.exerciseTime) || 0,
        'sleep time/h': parseFloat(data.sleepTime) || 0
      })
      console.log('Document written with ID: ', docRef.id)
      return docRef.id
    } catch (error) {
      console.error('Error adding health metric:', error)
      throw error
    }
  }

  static async getAppointments() {
    try {
      console.log('Fetching appointments from Firestore...')
      const q = query(collection(db, 'Appointments'), orderBy('start', 'desc'))
      const querySnapshot = await getDocs(q)
      const appointments = querySnapshot.docs.map(doc => {
        const docData = doc.data()
        return {
          id: doc.id,
          title: docData.title,
          start: docData.start ? docData.start.toDate() : new Date(),
          end: docData.end ? docData.end.toDate() : new Date(),
          description: docData.description || '',
          duration: docData.duration || 60,
          status: docData.status || 'scheduled'
        }
      })
      console.log('Total appointments fetched:', appointments.length)
      return appointments
    } catch (error) {
      console.error('Error fetching appointments:', error)
      return []
    }
  }

  static subscribeToAppointments(callback) {
    console.log('Setting up appointments real-time listener...')
    const q = query(collection(db, 'Appointments'), orderBy('start', 'desc'))
    return onSnapshot(q, (querySnapshot) => {
      console.log('Appointments real-time update received, documents:', querySnapshot.size)
      const appointments = querySnapshot.docs.map(doc => {
        const docData = doc.data()
        return {
          id: doc.id,
          title: docData.title,
          start: docData.start ? docData.start.toDate() : new Date(),
          end: docData.end ? docData.end.toDate() : new Date(),
          description: docData.description || '',
          duration: docData.duration || 60,
          status: docData.status || 'scheduled'
        }
      })
      callback(appointments)
    }, (error) => {
      console.error('Appointments real-time listener error:', error)
    })
  }

  static async addAppointment(appointmentData) {
    try {
      console.log('Adding new appointment to Firestore...', appointmentData)
      const docRef = await addDoc(collection(db, 'Appointments'), {
        title: appointmentData.title,
        start: Timestamp.fromDate(new Date(appointmentData.start)),
        end: Timestamp.fromDate(new Date(appointmentData.end)),
        description: appointmentData.description || '',
        duration: parseInt(appointmentData.duration) || 60,
        status: appointmentData.status || 'scheduled'
      })
      console.log('Appointment written with ID: ', docRef.id)
      return docRef.id
    } catch (error) {
      console.error('Error adding appointment:', error)
      throw error
    }
  }

  static async updateAppointmentStatus(appointmentId, status) {
    try {
      const appointmentRef = doc(db, 'Appointments', appointmentId)
      await updateDoc(appointmentRef, {
        status: status
      })
      console.log('Appointment status updated:', appointmentId, status)
    } catch (error) {
      console.error('Error updating appointment status:', error)
      throw error
    }
  }
}
