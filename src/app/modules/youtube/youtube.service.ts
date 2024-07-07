import prisma from '../../../shared/prisma';
import { Playlist, PlaylistDetail } from './youtube.interface';

const saveSelectedVideos = async (playlist: Playlist): Promise<Playlist> => {
  try {
    const createdPlaylist = await prisma.playlist.create({
      data: {
        playlistName: playlist.playlistName,
        order: playlist.order,
        playlist_Type: playlist.playlistType,
        created_By: playlist.createdBy,
        details: {
          create: playlist.details.map((detail) => ({
            videoLink: detail.videoLink,
            title: detail.title,
            description: detail.description,
            thumbnailUrl: detail.thumbnailUrl,
            order: detail.order,
          })),
        },
      },
      include: {
        details: true,
      },
    });

    console.log('Saved playlist and videos:', createdPlaylist);
    return {
      ...createdPlaylist,
      playlistType: createdPlaylist.playlist_Type,
      createdBy: createdPlaylist.created_By,
    };
  } catch (error) {
    console.error('Error saving videos:', error);
    throw new Error('Failed to save videos');
  }
};

const searchVideos = async (query: string): Promise<any> => {
  const baseURL = 'https://www.googleapis.com/youtube/v3/search';
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '50',
    key: process.env.YOUTUBE_API_KEY || '',
  });

  const response = await fetch(`${baseURL}?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      errorData.error?.message || 'Failed to perform YouTube search';
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
};

const getSavedVideosList = async (): Promise<Playlist[]> => {
  try {
    const playlists = await prisma.playlist.findMany({
      include: {
        details: true,
      },
    });

    // Map the response to the Playlist interface
    return playlists.map((playlist) => ({
      playlistName: playlist.playlistName,
      order: playlist.order,
      playlistType: playlist.playlist_Type,
      createdBy: playlist.created_By,
      details: playlist.details.map((detail) => ({
        id: detail.id,
        videoLink: detail.videoLink,
        title: detail.title,
        description: detail.description,
        thumbnailUrl: detail.thumbnailUrl,
        order: detail.order,
        playlistId: detail.playlistId,
      })),
    }));
  } catch (error) {
    console.error('Error retrieving saved videos:', error);
    throw new Error('Failed to retrieve saved videos');
  }
};

export const YoutubeService = {
  saveSelectedVideos,
  searchVideos,
  getSavedVideosList,
};
