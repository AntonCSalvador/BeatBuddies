import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';
import * as ImagePicker from 'expo-image-picker';
import { CLOUDINARY_URL } from '@/screens/spotify';

export default function AccountInfo() {
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(
        'https://i.pinimg.com/736x/a6/67/73/a667732975f0f1da1a0fd4625e30d776.jpg'
    );
    const [isUploading, setIsUploading] = useState(false);

    const handleDismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const handleImageUpload = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert('Permission Required', 'Please allow access to the media library.');
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

        const { uri, type: mimeType } = pickerResult.assets[0]; // Correct way to access the URI and MIME type
        const fileName = uri.split('/').pop(); // Extract the file name from URI
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', {
                uri,
                name: fileName || 'upload', // Use the actual file name if available
                type: mimeType || 'image/jpeg', // Fallback to 'image/jpeg' if type is undefined
            } as any);
            formData.append('upload_preset', 'beatbuddies'); // Replace with your Cloudinary preset
            formData.append('cloud_name', 'dk4wmqxux'); // Replace with your Cloudinary cloud name

            const response = await fetch(`${CLOUDINARY_URL}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setAvatarUrl(data.secure_url);
            Alert.alert('Upload Successful', 'Your picture has been uploaded.');
        } catch (error) {
            Alert.alert('Upload Failed', 'Something went wrong during the upload.');
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = () => {
        console.log('Submitted:', { displayName, bio, avatarUrl });
    };

    return (
        <SafeAreaViewAll color="white">
            <TouchableWithoutFeedback onPress={handleDismissKeyboard}>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={60}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
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
                            Your BeatBuddies Account
                        </Text>

                        {/* Avatar Section */}
                        <View style={{ alignItems: 'center', marginBottom: 24 }}>
                            <Image
                                source={{ uri: avatarUrl }}
                                style={{
                                    width: 96,
                                    height: 96,
                                    borderRadius: 48,
                                    marginBottom: 16,
                                }}
                            />
                            <TouchableOpacity
                                onPress={handleImageUpload}
                                style={{
                                    padding: 10,
                                    backgroundColor: isUploading ? '#ccc' : '#f0f0f0',
                                    borderRadius: 8,
                                }}
                                disabled={isUploading}
                            >
                                <Text style={{ fontSize: 14, color: '#007BFF' }}>
                                    {isUploading ? 'Uploading...' : 'Upload Picture'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Display Name Input */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                                Display Name
                            </Text>
                            <TextInput
                                placeholder="Your display name"
                                value={displayName}
                                onChangeText={setDisplayName}
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

                        {/* Bio Input */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Bio</Text>
                            <TextInput
                                placeholder="Tell us about yourself and your music taste..."
                                value={bio}
                                onChangeText={setBio}
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

                        {/* Save Changes Button */}
                        <TouchableOpacity
                            onPress={handleSubmit}
                            style={{
                                paddingVertical: 14,
                                borderRadius: 8,
                                backgroundColor: '#007BFF',
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaViewAll>
    );
}
