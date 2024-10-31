# BeatBuddies

**BeatBuddies** is a mobile app designed to be the **Letterboxd for Music**. With this app, users can track, review, and share their favorite music and explore others' recommendations. The app integrates the Spotify API for music data and authentication and uses Firebase for additional authentication features.

## Technologies Used
- **Spotify API**: Provides access to music data for user tracking and exploration.
- **ExpoGo**: Enables quick development and testing on mobile devices.
- **React Native**: Powers the cross-platform mobile interface.
- **Firebase**: Used for user authentication, currently set up with SMS-based authentication (Blaze plan required).

## Getting Started

To run the app locally, follow these steps:

### 1. Clone the Repository
Clone the repository to your local machine and navigate to the project directory.

```bash
git clone <git@github.com:AntonCSalvador/BeatBuddies.git>
cd BeatBuddies
```

## 2. Install Dependencies

Navigate to the `frontend` directory and install the necessary packages.

```bash
cd frontend
npm install
```

## 3. Set Up Environment Variables

Create a `.env` file in the `frontend` directory with the following content. The Spotify credentials can be obtained from the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).

```plaintext
SPOTIFY_CLIENT_ID=xxxxxx
SPOTIFY_CLIENT_SECRET=xxxxx
```

## 4. Set Up Firebase

- Set up a Firebase account and enable authentication (currently, SMS authentication requires the Firebase Blaze plan).
- **Note**: Future releases will include a version without SMS authentication.

## Running the App

After completing the setup, start the Expo development server:

```bash
npx expo start
```

This will open the Expo Developer Tools in your browser. From here, you can use Expo Go to run the app on a connected device or emulator.

Common issue is solved by doing npx expo start --tunnel and making sure you are on the same wifi as the laptop running it.

## Future Plans

- **Non-SMS Authentication**: Develop an authentication version that doesn’t rely on SMS.
- **Enhanced Music Discovery**: More Spotify integrations to enable better music exploration and recommendations.

## Contributors

- **Kaleb** - Project Manager & Developer
- **Anton** - Scrum Master & Developer
- **Fernando** - Groomer & Developer
- **Shashank** - Developer

For questions or contributions, feel free to reach out to the team through this repository.

