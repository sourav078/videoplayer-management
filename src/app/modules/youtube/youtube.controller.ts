import catchAsync from '../../../shared/catchAsync';
import { YoutubeService } from './youtube.service';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { Playlist } from './youtube.interface';

// Search YouTube videos
const searchVideos = catchAsync(async (req: Request, res: Response) => {
    const query = req.query.q as string;

    if (!query) {
        return sendResponse(res, {
            message: 'Query is required',
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
        });
    }

    const data = await YoutubeService.searchVideos(query);

    return sendResponse(res, {
        data: data.items,
        message: 'YouTube search successful',
        statusCode: httpStatus.OK,
        success: true,
    });
});

// Save selected videos
const saveVideos = catchAsync(async (req: Request, res: Response) => {
    const playlist: Playlist = req.body;

    if (!playlist.playlistName || !playlist.details || !playlist.details.length) {
        return sendResponse(res, {
            message: 'Playlist name and details are required',
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
        });
    }

    const data = await YoutubeService.saveSelectedVideos(playlist);

    return sendResponse(res, {
        data,
        message: 'Videos saved successfully',
        statusCode: httpStatus.OK,
        success: true,
    });
});

// Get saved videos list
const getSavedVideosList = catchAsync(async (req: Request, res: Response) => {
    const data = await YoutubeService.getSavedVideosList();

    return sendResponse(res, {
        data,
        message: 'Saved videos retrieved successfully',
        statusCode: httpStatus.OK,
        success: true,
    });
});

export const YoutubeController = {
    searchVideos,
    saveVideos,
    getSavedVideosList,
};
