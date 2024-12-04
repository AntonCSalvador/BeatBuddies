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
} from 'react-native';
import SafeAreaViewAll from '@/components/general/SafeAreaViewAll';

export default function AccountInfo() {
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl] = useState('https://i.pinimg.com/736x/a6/67/73/a667732975f0f1da1a0fd4625e30d776.jpg');

    const handleDismissKeyboard = () => {
        Keyboard.dismiss();
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
                    keyboardVerticalOffset={60} // Adjust for header height
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 }}>
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
                                onPress={() => console.log('Upload Picture')}
                                style={{
                                    padding: 10,
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: 8,
                                }}
                            >
                                <Text style={{ fontSize: 14, color: '#007BFF' }}>Upload Picture</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Display Name Input */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Display Name</Text>
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
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Save Changes</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaViewAll>
    );
}
