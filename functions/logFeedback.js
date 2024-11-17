const admin = require('firebase-admin');

// Initialize Firebase Admin SDK using environment variables
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Convert \n to actual newlines
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
});

const db = admin.firestore();

exports.handler = async (event) => {
    try {
        // Parse the feedback data from the request body
        const feedbackData = JSON.parse(event.body);

        // Log the feedback data to the Netlify function logs
        console.log("Received feedback data:", feedbackData);

        // Save the feedback data to Firestore
        const docRef = await db.collection('feedback').add(feedbackData);
        console.log('Feedback saved with ID:', docRef.id);

        // Respond with a success message
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Feedback logged and saved to Firestore successfully!' })
        };
    } catch (error) {
        console.error('Error logging or saving feedback:', error);

        // Respond with an error message
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to log and save feedback.' })
        };
    }
};
