const express = require('express');
const router = express.Router();
const {
    getHeroContent,
    updateHeroContent,
    getPlatformContent,
    updatePlatformContent,
    getFaqsContent,
    updateFaqsContent,
    getTacticalContent,
    updateTacticalContent,
    getFooterCtaContent,
    updateFooterCtaContent
} = require('../controllers/landingPageController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Hero Routes
router.get('/hero', getHeroContent);
router.put('/hero', protect, authorize('superadmin', 'super_admin'), updateHeroContent);

// Platform Routes
router.get('/platform', getPlatformContent);
router.put('/platform', protect, authorize('superadmin', 'super_admin'), upload.single('authorImage'), updatePlatformContent);

// FAQ Routes
router.get('/faqs', getFaqsContent);
router.put('/faqs', protect, authorize('superadmin', 'super_admin'), updateFaqsContent);

// Tactical Routes
router.get('/tactical', getTacticalContent);
router.put('/tactical', protect, authorize('superadmin', 'super_admin'), upload.fields([
    { name: 'image_0', maxCount: 1 },
    { name: 'image_1', maxCount: 1 },
    { name: 'image_2', maxCount: 1 }
]), updateTacticalContent);

// Footer CTA Routes
router.get('/footer-cta', getFooterCtaContent);
router.put('/footer-cta', protect, authorize('superadmin', 'super_admin'), upload.fields([
    { name: 'image_0', maxCount: 1 },
    { name: 'image_1', maxCount: 1 },
    { name: 'image_2', maxCount: 1 },
    { name: 'image_3', maxCount: 1 }
]), updateFooterCtaContent);

module.exports = router;
