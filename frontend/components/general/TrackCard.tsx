import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
// import { db } from '@/firebase/firebaseConfig';
import { useSession } from '@/contexts/SessionContext';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { FontAwesome } from '@expo/vector-icons';
import Track from '@/types/track';

interface TrackCardProps {
    track: Track;
}

const TrackCard: React.FC<TrackCardProps> = ({ track }) => {
    const { session } = useSession();
    // const [rating, setRating] = useState<number | null>(null);
    // const [averageRating, setAverageRating] = useState<number | null>(null);
    const [ratingsCount, setRatingsCount] = useState<number>(0);

    // Fetch rating data from Firestore
    // useEffect(() => {
    //     const fetchRating = async () => {
    //         try {
    //             const docRef = doc(db, 'ratings', track.id);
    //             const docSnap = await getDoc(docRef);
    //             if (docSnap.exists()) {
    //                 const data = docSnap.data();
    //                 setAverageRating(data.averageRating);
    //                 setRatingsCount(data.ratingsCount);
    //                 console.log('Fetched rating:', data);
    //             } else {
    //                 console.log('No document found for this track.');
    //             }
    //         } catch (error) {
    //             console.error('Error fetching rating:', error);
    //         }
    //     };
    //     fetchRating();
    // }, [track.id]);

    // // Submit rating to Firestore
    // const submitRating = async (userRating: number) => {
    //     if (!session) {
    //         alert('Please log in to rate this track.');
    //         return;
    //     }

    //     setRating(userRating);

    //     try {
    //         const docRef = doc(db, 'ratings', track.id);
    //         const docSnap = await getDoc(docRef);

    //         if (docSnap.exists()) {
    //             const data = docSnap.data();
    //             const newAverage =
    //                 (data.averageRating * data.ratingsCount + userRating) /
    //                 (data.ratingsCount + 1);

    //             await updateDoc(docRef, {
    //                 averageRating: newAverage,
    //                 ratingsCount: increment(1),
    //             });
    //             setAverageRating(newAverage);
    //             setRatingsCount((prev) => prev + 1);
    //             console.log(
    //                 'Updated rating:',
    //                 newAverage,
    //                 'Count:',
    //                 ratingsCount + 1
    //             );
    //         } else {
    //             await setDoc(docRef, {
    //                 averageRating: userRating,
    //                 ratingsCount: 1,
    //             });
    //             setAverageRating(userRating);
    //             setRatingsCount(1);
    //             console.log('New rating created:', userRating);
    //         }
    //     } catch (error) {
    //         console.error('Error submitting rating:', error);
    //     }
    // };

    return (
        <TouchableOpacity className="mr-4 w-36">
            <View className="w-full flex justify-center items-center">
                <Image
                    source={{ uri: track.album.images[0]?.url }}
                    className="w-full aspect-square rounded-lg"
                />
            </View>
            <View className="flex flex-col mt-2">
                <Text
                    className="font-bold text-base"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {track.name}
                </Text>
                <Text
                    className=" text-gray-500 text-sm"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {track.artists.map((artist) => artist.name).join(', ')}
                </Text>
                <Text
                    className=" text-gray-400 text-xs"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {track.album.name}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default TrackCard;
