export default interface Track {
    id: string; //id of the track
    name: string; //name of the track
    artists: { name: string }[]; // Array of artist objects
    album: {
        name: string;
        images: { url: string }[];
    };
};