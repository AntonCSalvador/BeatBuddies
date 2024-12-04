export default interface Track {
    id: string;
    name: string;
    artists: { name: string }[]; // Array of artist objects
    album: {
        name: string;
        images: { url: string }[];
    };
};