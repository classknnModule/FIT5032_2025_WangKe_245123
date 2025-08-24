const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/v2/https");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const functions = require('firebase-functions');
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp();
}

exports.getAuthUsers = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const adminEmail = 'admin@example.com';
  if (context.auth.token.email !== adminEmail) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admin can access user data'
    );
  }

  try {
    const listUsersResult = await admin.auth().listUsers(1000);
    const users = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
      providerData: userRecord.providerData
    }));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newUsersToday = users.filter(user => {
      const creationDate = new Date(user.creationTime);
      return creationDate >= today;
    }).length;

    const activeUsers = users.filter(user => {
      if (!user.lastSignInTime) return false;
      const lastSignIn = new Date(user.lastSignInTime);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastSignIn >= thirtyDaysAgo;
    }).length;

    return {
      totalUsers: users.length,
      newUsersToday,
      activeUsers,
      users: users.slice(0, 50)
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error fetching user data'
    );
  }
});

setGlobalOptions({ maxInstances: 10 });

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = onCall(async (request) => {
  try {
    const { to, subject, message, attachments } = request.data;
    const context = request.auth;

    if (!context) {
      throw new Error('User must be authenticated');
    }

    const userEmail = context.token.email;
    const userName = context.token.name || userEmail.split('@')[0];

    logger.info('Sending email', {
      from: userEmail,
      to: to,
      subject: subject
    });

    const mailOptions = {
      from: `${userName} <${userEmail}>`,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0;">Message from ${userName}</h2>
            <p style="color: #666; margin: 5px 0 0 0;">Sent via Mental Health Platform</p>
          </div>

          <div style="background-color: white; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px;">
            <div style="white-space: pre-wrap; line-height: 1.6; color: #333;">${message}</div>
          </div>

          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666;">
            <p style="margin: 0;"><strong>Sender:</strong> ${userName} (${userEmail})</p>
            <p style="margin: 5px 0 0 0;"><strong>Sent:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 5px 0 0 0;">This email was sent through the Mental Health Platform</p>
          </div>
        </div>
      `,
      replyTo: userEmail
    };

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map(attachment => ({
        filename: attachment.name,
        content: attachment.content,
        encoding: 'base64'
      }));
    }

    const result = await transporter.sendMail(mailOptions);

    await admin.firestore().collection('email_logs').add({
      from: userEmail,
      to: to,
      subject: subject,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      messageId: result.messageId,
      status: 'sent'
    });

    logger.info('Email sent successfully', { messageId: result.messageId });

    return {
      success: true,
      messageId: result.messageId,
      message: 'Email sent successfully'
    };

  } catch (error) {
    logger.error('Error sending email', error);

    await admin.firestore().collection('email_logs').add({
      from: request.auth?.token?.email || 'unknown',
      to: request.data?.to || 'unknown',
      subject: request.data?.subject || 'unknown',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: 'failed',
      error: error.message
    });

    throw new Error(`Failed to send email: ${error.message}`);
  }
});

exports.getUserStats = onCall(async (request) => {
  try {
    const context = request.auth;
    if (!context) {
      throw new Error('User must be authenticated');
    }

    const userEmail = context.token.email;
    const emailLogs = await admin.firestore()
      .collection('email_logs')
      .where('from', '==', userEmail)
      .orderBy('timestamp', 'desc')
      .limit(10)
      .get();

    const stats = {
      totalEmails: emailLogs.size,
      recentEmails: emailLogs.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }))
    };

    return stats;

  } catch (error) {
    logger.error('Error getting user stats', error);
    throw new Error(`Failed to get user stats: ${error.message}`);
  }
});
