const admin = require('../config/firebase');

/**
 * Send a push notification to specific FCM tokens
 * @param {string|string[]} tokens - FCM token or array of tokens
 * @param {object} payload - Notification payload { title, body, data }
 */
const sendPushNotification = async (tokens, payload) => {
    if (!tokens || (Array.isArray(tokens) && tokens.length === 0)) {
        return;
    }

    const { title, body, data } = payload;

    const message = {
        notification: {
            title,
            body
        },
        data: data || {},
    };

    try {
        if (Array.isArray(tokens)) {
            // Filter out empty tokens
            const validTokens = tokens.filter(t => t && t.trim() !== '');
            if (validTokens.length === 0) return;

            const response = await admin.messaging().sendEachForMulticast({
                tokens: validTokens,
                ...message
            });
            console.log(`Successfully sent ${response.successCount} notifications`);
            return response;
        } else {
            if (!tokens || tokens.trim() === '') return;

            const response = await admin.messaging().send({
                token: tokens,
                ...message
            });
            console.log('Successfully sent notification:', response);
            return response;
        }
    } catch (error) {
        console.error('Error sending push notification:', error);
        // We don't necessarily want to throw and crash the calling process
        // since push notifications are often "best-effort"
        return { error };
    }
};

module.exports = sendPushNotification;
