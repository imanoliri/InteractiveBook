// functions/logFeedback.js

exports.handler = async (event) => {
    try {
        // Parse the feedback data from the request body
        const feedbackData = JSON.parse(event.body);

        // Log the feedback data to the Netlify function logs
        console.log("Received feedback data:", feedbackData);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Feedback logged successfully!' })
        };
    } catch (error) {
        console.error('Error logging feedback:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to log feedback.' })
        };
    }
};
