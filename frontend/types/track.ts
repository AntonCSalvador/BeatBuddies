export default interface Track {
    id: string;
    name: string;
    artists: { name: string }[];
    album: {
        name: string;
        images: { url: string }[];
    };
}