import express from 'express';
import { YoutubeController } from './youtube.controller';

const router = express.Router();

router.get('/search', YoutubeController.searchVideos);
router.post('/save-selected-videos', YoutubeController.saveVideos);
router.get('/saved-videos-list', YoutubeController.getSavedVideosList);

export const youtubeRouter = router;
