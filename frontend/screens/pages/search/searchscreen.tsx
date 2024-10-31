import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image } from 'react-native';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '@env';

// Define the type for the track data, including album images
interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumCover: string;
}

// Function to get the access token
async function getAccessToken() {
  const clientId = SPOTIFY_CLIENT_ID;
  const clientSecret = SPOTIFY_CLIENT_SECRET;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`)
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

// Function to search for a track by name
async function searchTrackByName(trackName: string): Promise<Track | null> {
  const token = await getAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track&limit=1`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const searchData = await response.json();
  if (searchData.tracks.items.length > 0) {
    const track = searchData.tracks.items[0];
    return {
      id: track.id,
      name: track.name,
      artist: track.artists[0].name,
      album: track.album.name,
      albumCover: track.album.images[0].url
    };
  } else {
    return null;
  }
}

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Function to handle search
  const handleSearch = async () => {
    try {
      const result = await searchTrackByName(searchText);
      if (result) {
        setTrack(result);
        setError(null);
      } else {
        setTrack(null);
        setError('Track not found');
      }
    } catch (err) {
      setError('An error occurred while searching');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Enter track name"
        value={searchText}
        onChangeText={setSearchText}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 8,
          marginBottom: 16,
          borderRadius: 4,
        }}
      />
      <Button title="Search" onPress={handleSearch} />

      {error && <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text>}

      {track ? (
        <View style={{ marginTop: 16 }}>
          <Text>Track ID: {track.id}</Text>
          <Text>Track Name: {track.name}</Text>
          <Text>Artist: {track.artist}</Text>
          <Text>Album: {track.album}</Text>
          {track.albumCover ? (
            <Image 
              source={{ uri: track.albumCover }}
              style={{ width: 200, height: 200, marginTop: 8 }}
            />
          ) : (
            <Text>No Album Cover Available</Text>
          )}
        </View>
      ) : (
        !error && <Text style={{ marginTop: 16 }}>Enter a track name and press "Search"</Text>
      )}
    </View>
  );
}
