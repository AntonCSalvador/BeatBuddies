import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_URL } from '@/screens/spotify';
import { useRouter } from 'expo-router';
import { auth, db } from '@/firebase/firebaseConfig';
import {
    doc,
    setDoc,
    collection,
    addDoc,
    serverTimestamp,
} from 'firebase/firestore';

//Function that creates a new list
export default function CreateNewListPage() {
    const [listTitle, setListTitle] = useState('');
    const [listDescription, setListDescription] = useState('');
    const [listCover, setListCover] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const router = useRouter();

    const handleDismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const handleUploadCover = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert(
                'Permission Required',
                'Please allow access to the media library.'
            );
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (pickerResult.canceled) {
            return;
        }

        const { uri, type: mimeType } = pickerResult.assets[0];
        const fileName = uri.split('/').pop();
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', {
                uri,
                name: fileName || 'upload',
                type: mimeType || 'image/jpeg',
            } as any);
            formData.append('upload_preset', 'beatbuddies'); // Replace with your Cloudinary preset

            const response = await fetch(`${CLOUDINARY_URL}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            setListCover(data.secure_url);
            Alert.alert(
                'Upload Successful',
                'Your cover image has been uploaded.'
            );
        } catch (error) {
            Alert.alert(
                'Upload Failed',
                'Something went wrong during the upload.'
            );
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    //Function that checks whether all fields for a list have been enetered, else throws an error
    const handleSaveList = async () => {
        if (!listTitle.trim() || !listDescription.trim()) {
            Alert.alert(
                'Missing Fields',
                'Please fill out all required fields.'
            );
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Alert.alert('Error', 'No user is currently signed in.');
            return;
        }

        try {
            const userId = user.uid;
            const listData = {
                title: listTitle,
                description: listDescription,
                cover: listCover,
                createdAt: serverTimestamp(),
            };

            // Reference to the user's lists collection
            const listsCollectionRef = collection(db, 'users', userId, 'lists');

            // Add a new document with an auto-generated ID
            const listDocRef = await addDoc(listsCollectionRef, listData);

            Alert.alert('Success', 'Your list has been created!');
            console.log('List Created:', { id: listDocRef.id, ...listData });

            // Optionally, navigate to the AddToList page with the new list ID
            router.push(`/profile/AddToList?listId=${listDocRef.id}`);
        } catch (error) {
            console.error('Error creating list:', error);
            Alert.alert(
                'Error',
                'Failed to create your list. Please try again.'
            );
        }
    };

    return (
        <SafeAreaViewAll color="white">
            <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ padding: 16 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginBottom: 16,
                            }}
                        >
                            Create New List
                        </Text>

                        {/* Cover Image Upload */}
                        <View
                            style={{ alignItems: 'center', marginBottom: 24 }}
                        >
                            {listCover ? (
                                <Image
                                    source={{ uri: listCover }}
                                    style={{
                                        width: 200,
                                        height: 200,
                                        borderRadius: 12,
                                        marginBottom: 16,
                                    }}
                                />
                            ) : (
                                <View
                                    style={{
                                        width: 200,
                                        height: 200,
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: 12,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: 16,
                                    }}
                                >
                                    <Text style={{ color: '#bbb' }}>
                                        No Cover Image
                                    </Text>
                                </View>
                            )}
                            <TouchableOpacity
                                onPress={handleUploadCover}
                                style={{
                                    padding: 10,
                                    backgroundColor: isUploading
                                        ? '#ccc'
                                        : '#007BFF',
                                    borderRadius: 8,
                                }}
                                disabled={isUploading}
                            >
                                <Text style={{ fontSize: 14, color: '#fff' }}>
                                    {isUploading
                                        ? 'Uploading...'
                                        : 'Upload Cover'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* List Title */}
                        <View style={{ marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    marginBottom: 8,
                                }}
                            >
                                List Title
                            </Text>
                            <TextInput
                                placeholder="Enter list title"
                                value={listTitle}
                                onChangeText={setListTitle}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 16,
                                    backgroundColor: '#fff',
                                }}
                            />
                        </View>

                        {/* List Description */}
                        <View style={{ marginBottom: 16 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    marginBottom: 8,
                                }}
                            >
                                Description
                            </Text>
                            <TextInput
                                placeholder="Describe your list"
                                value={listDescription}
                                onChangeText={setListDescription}
                                multiline
                                numberOfLines={4}
                                style={{
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 8,
                                    padding: 12,
                                    fontSize: 16,
                                    backgroundColor: '#fff',
                                    textAlignVertical: 'top',
                                }}
                            />
                        </View>

                        {/* Save List Button */}
                        <TouchableOpacity
                            onPress={handleSaveList}
                            style={{
                                marginTop: 24,
                                paddingVertical: 14,
                                borderRadius: 8,
                                backgroundColor: '#007BFF',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#fff',
                                }}
                            >
                                Save List
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaViewAll>
    );
}
