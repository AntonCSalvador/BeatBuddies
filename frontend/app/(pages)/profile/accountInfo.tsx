// AccountInfo.tsx

import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'expo-router';
import { auth, db } from '@/firebase/firebaseConfig'; // Import Firebase modules
import { getDoc, doc, updateDoc } from 'firebase/firestore'; // Import Firestore functions

export default function AccountInfo() {
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(
      'https://i.pinimg.com/736x/a6/67/73/a667732975f0f1da1a0fd4625e30d776.jpg'
    );
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    const router = useRouter();
  
    useEffect(() => {
      const fetchUserData = async () => {
        const user = auth.currentUser;
        if (!user) {
          console.log('No user is currently signed in.');
          return;
        }
  
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnapshot = await getDoc(userRef);
  
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setDisplayName(userData.displayName || '');
            setBio(userData.Bio || '');
            setAvatarUrl(userData.profileImageLink || avatarUrl);
          } else {
            console.log('User document does not exist.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          Alert.alert('Error', 'Failed to fetch user data.');
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUserData();
    }, []);

  const handleDismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const validateInput = () => {
    const displayNameRegex = /^[a-zA-Z0-9 _]{1,15}$/;
    if (!displayNameRegex.test(displayName)) {
      Alert.alert(
        'Invalid Display Name',
        'Display Name must be less than 15 characters and can only contain letters, numbers, spaces, and underscores.'
      );
      return false;
    }
    if (bio.length > 250) {
      Alert.alert('Invalid Bio', 'Bio must be less than 250 characters.');
      return false;
    }
    return true;
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

  const handleSubmit = async () => {
    if (validateInput()) {
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'No user is currently signed in.');
        return;
      }

      try {
        // Reference to the user's document in Firestore
        const userRef = doc(db, 'users', user.uid);

        // Update the document with new data
        await updateDoc(userRef, {
          displayName: displayName,
          Bio: bio,
          profileImageLink: avatarUrl,
        });

       

        console.log('Profile updated:', { displayName, bio, avatarUrl });
        Alert.alert('Success', 'Your profile has been updated!');
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update your profile. Please try again.');
      }
    }
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
            <Text className="text-2xl font-bold text-center mb-4">
              Your BeatBuddies Account
            </Text>

            {/* Avatar Section */}
            <View className="items-center mb-6">
              <Image
                source={{ uri: avatarUrl }}
                className="w-24 h-24 rounded-full mb-4"
              />
              <TouchableOpacity
                onPress={handleImageUpload}
                className={`py-2 px-4 rounded-lg ${
                  isUploading ? 'bg-gray-300' : 'bg-blue-500'
                }`}
                disabled={isUploading}
              >
                <Text className="text-white text-sm">
                  {isUploading ? 'Uploading...' : 'Upload Picture'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Display Name Input */}
            <View className="mb-4">
              <Text className="text-lg font-bold mb-2">Display Name</Text>
              <TextInput
                placeholder="Your display name"
                value={displayName}
                onChangeText={setDisplayName}
                className="border border-gray-300 rounded-lg p-3 bg-white text-sm"
              />
            </View>

            {/* Bio Input */}
            <View className="mb-4">
              <Text className="text-lg font-bold mb-2">Bio</Text>
              <TextInput
                placeholder="Tell us about yourself and your music taste..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                className="border border-gray-300 rounded-lg p-3 bg-white text-sm text-justify"
              />
            </View>

            {/* Save Changes Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              className="py-4 rounded-lg bg-blue-500"
            >
              <Text className="text-center text-white font-semibold">
                Save Changes
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaViewAll>
  );
}
