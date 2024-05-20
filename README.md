# CommuterHelper

The Commuter Helper is a service designed to improve the daily commuting experience by providing features such as automatic route suggestions, estimated travel times, daily email updates, and integrated scheduling. The project utilizes several key technologies:

**Frontend:** Built with ReactJS, which provides a dynamic and responsive user interface.

**Mapping and Directions:** Uses the Google Maps API to fetch real-time traffic data and provide optimal route suggestions.

**Backend:** Firebase is used for user authentication and hosting, ensuring secure and reliable data handling.

**Cloud Functions:** Leveraged for executing backend operations in response to events, such as sending daily email updates with the best routes for the day.

Key features include:

**Automatic Route Suggestions:** Provides users with the fastest and most efficient routes based on current traffic conditions.

**Daily Email Updates:** Sends personalized commute plans each morning.

# GoogleCloudFunction

This code is a Google Cloud Function named sendEmails that executes periodically to provide users with daily commute information via email. It leverages Firebase services for database management and Nodemailer for email transmission. Operating between 8 AM and 11 AM from Monday to Friday in the America/Los_Angeles timezone, the function retrieves user data from Firestore and verifies if users have provided necessary commute details such as email, home and work addresses, and departure time. When a user's specified departure time matches the current time, it employs the Google Maps API to calculate the best route and time estimate for the commute. Then, it constructs an email containing this information along with a static map image illustrating the route. This email is sent using Nodemailer, ensuring the user receives timely and pertinent commute updates. Throughout the process, the function logs events and errors to facilitate debugging.

