
export interface PlaylistDetail {
  id: number;
  videoLink: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  order: number;
  playlistId: number;
}

export interface Playlist {
  playlistName: string;
  order: number;
  playlistType: 'admin' | 'parent';
  createdBy: string;
  details: PlaylistDetail[];
}
