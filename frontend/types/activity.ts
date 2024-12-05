// /types/activity.ts
export default interface Activity {
    id: string;
    username: string;
    userAvatar: string;
    action: string;
    songTitle?: string; // Optional if not every activity has a song
    artist?: string; // Optional if not every activity has an artist
    album?: string; // Optional if not every activity has an album
    review?: string; // Optional if not every activity has a review
    rating?: number; // Optional if not every activity has a rating
    timestamp: string;
    coverImage?: string; // Optional if not every activity has a cover image
}
