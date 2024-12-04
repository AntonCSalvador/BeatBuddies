// /types/Activity.ts
export default interface Activity {
    id: string;
    username: string;
    userAvatar: string;
    action: string; // "watched", "reviewed", "liked"
    movieTitle: string;
    review?: string; // Optional review text
    rating?: number; // Optional rating (1-5)
    timestamp: string; // ISO string
    posterImage: string; // URL of the movie poster
}