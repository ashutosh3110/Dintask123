const LandingPageContent = require('../models/LandingPageContent');

// @desc    Get Landing Page Content (Hero)
// @route   GET /api/v1/landing-page/hero
// @access  Public
exports.getHeroContent = async (req, res, next) => {
    try {
        let content = await LandingPageContent.findOne();

        if (!content) {
            content = await LandingPageContent.create({});
        }

        res.status(200).json({
            success: true,
            data: content.hero
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Landing Page Content (Hero)
// @route   PUT /api/v1/landing-page/hero
// @access  Private (SuperAdmin)
exports.updateHeroContent = async (req, res, next) => {
    try {
        const { badge, title, subtitle, ctaPrimary, ctaSecondary } = req.body;

        let content = await LandingPageContent.findOne();

        if (!content) {
            content = await LandingPageContent.create({});
        }

        // Update fields if provided
        if (badge) content.hero.badge = badge;
        if (title) content.hero.title = title;
        if (subtitle) content.hero.subtitle = subtitle;
        if (ctaPrimary) content.hero.ctaPrimary = ctaPrimary;
        if (ctaSecondary) content.hero.ctaSecondary = ctaSecondary;

        await content.save();

        res.status(200).json({
            success: true,
            data: content.hero,
            message: 'Hero section updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Landing Page Content (Platform Section)
// @route   GET /api/v1/landing-page/platform
// @access  Public
exports.getPlatformContent = async (req, res, next) => {
    try {
        let content = await LandingPageContent.findOne();

        if (!content) {
            content = await LandingPageContent.create({});
        }

        res.status(200).json({
            success: true,
            data: content.platformSection
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Landing Page Content (Platform Section)
// @route   PUT /api/v1/landing-page/platform
// @access  Private (SuperAdmin)
exports.updatePlatformContent = async (req, res, next) => {
    try {
        const { badge, title, subtitle, description, ctaText, quote, authorName, authorRole, authorImage: authorImageUrl } = req.body;
        let imageUrl = authorImageUrl;

        if (req.file) {
            imageUrl = req.file.path;
        }

        let content = await LandingPageContent.findOne();

        if (!content) {
            content = await LandingPageContent.create({});
        }

        // Update fields if provided
        if (badge) content.platformSection.badge = badge;
        if (title) content.platformSection.title = title;
        if (subtitle) content.platformSection.subtitle = subtitle;
        if (description) content.platformSection.description = description;
        if (ctaText) content.platformSection.ctaText = ctaText;
        if (quote) content.platformSection.quote = quote;
        if (authorName) content.platformSection.authorName = authorName;
        if (authorRole) content.platformSection.authorRole = authorRole;
        if (imageUrl) content.platformSection.authorImage = imageUrl;

        await content.save();

        res.status(200).json({
            success: true,
            data: content.platformSection,
            message: 'Platform section updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Landing Page Content (FAQs)
// @route   GET /api/v1/landing-page/faqs
// @access  Public
exports.getFaqsContent = async (req, res, next) => {
    try {
        let content = await LandingPageContent.findOne();

        if (!content) {
            content = await LandingPageContent.create({});
        }

        res.status(200).json({
            success: true,
            data: content.faqs
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Landing Page Content (FAQs)
// @route   PUT /api/v1/landing-page/faqs
// @access  Private (SuperAdmin)
exports.updateFaqsContent = async (req, res, next) => {
    try {
        const { faqs } = req.body;

        let content = await LandingPageContent.findOne();

        if (!content) {
            content = await LandingPageContent.create({});
        }

        if (faqs && Array.isArray(faqs)) {
            // Ensure we only store valid objects
            content.faqs = faqs.map(faq => ({
                question: faq.question,
                answer: faq.answer
            }));
        }

        await content.save();

        res.status(200).json({
            success: true,
            data: content.faqs,
            message: 'FAQs updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Landing Page Content (Tactical Section)
// @route   GET /api/v1/landing-page/tactical
// @access  Public
exports.getTacticalContent = async (req, res, next) => {
    try {
        let content = await LandingPageContent.findOne();

        if (!content) {
            content = await LandingPageContent.create({});
        }

        res.status(200).json({
            success: true,
            data: content.tacticalSection
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Landing Page Content (Tactical Section)
// @route   PUT /api/v1/landing-page/tactical
// @access  Private (SuperAdmin)
exports.updateTacticalContent = async (req, res, next) => {
    try {
        const { title, subtitle } = req.body;

        let content = await LandingPageContent.findOne();
        if (!content) {
            content = await LandingPageContent.create({});
        }

        // Initialize images array if it doesn't exist
        if (!content.tacticalSection.images) {
            content.tacticalSection.images = [];
        }

        if (title) content.tacticalSection.title = title;
        if (subtitle) content.tacticalSection.subtitle = subtitle;

        const finalImages = [...(content.tacticalSection.images || [])];

        // Ensure we have 3 slots
        while (finalImages.length < 3) finalImages.push("");

        if (req.files) {
            if (req.files['image_0']) finalImages[0] = req.files['image_0'][0].path;
            if (req.files['image_1']) finalImages[1] = req.files['image_1'][0].path;
            if (req.files['image_2']) finalImages[2] = req.files['image_2'][0].path;
        }

        content.tacticalSection.images = finalImages.slice(0, 3);

        await content.save();

        res.status(200).json({
            success: true,
            data: content.tacticalSection,
            message: 'Tactical section updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Landing Page Content (Footer CTA)
// @route   GET /api/v1/landing-page/footer-cta
// @access  Public
exports.getFooterCtaContent = async (req, res, next) => {
    try {
        let content = await LandingPageContent.findOne();

        if (!content) {
            content = await LandingPageContent.create({});
        }

        res.status(200).json({
            success: true,
            data: content.footerCta
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update Landing Page Content (Footer CTA)
// @route   PUT /api/v1/landing-page/footer-cta
// @access  Private (SuperAdmin)
exports.updateFooterCtaContent = async (req, res, next) => {
    try {
        const { title, description, ctaPrimary, ctaSecondary } = req.body;

        let content = await LandingPageContent.findOne();
        if (!content) {
            content = await LandingPageContent.create({});
        }

        // Initialize object if it doesn't exist (e.g. schema changed)
        if (!content.footerCta) {
            content.footerCta = { images: [] };
        }
        if (!content.footerCta.images) {
            content.footerCta.images = [];
        }

        if (title) content.footerCta.title = title;
        if (description) content.footerCta.description = description;
        if (ctaPrimary) content.footerCta.ctaPrimary = ctaPrimary;
        if (ctaSecondary) content.footerCta.ctaSecondary = ctaSecondary;

        const finalImages = [...(content.footerCta.images || [])];

        // Ensure we have 4 slots (as per frontend usage [0,1,2,3])
        while (finalImages.length < 4) finalImages.push("");

        if (req.files) {
            if (req.files['image_0']) finalImages[0] = req.files['image_0'][0].path;
            if (req.files['image_1']) finalImages[1] = req.files['image_1'][0].path;
            if (req.files['image_2']) finalImages[2] = req.files['image_2'][0].path;
            if (req.files['image_3']) finalImages[3] = req.files['image_3'][0].path;
        }

        content.footerCta.images = finalImages.slice(0, 4);

        await content.save();

        res.status(200).json({
            success: true,
            data: content.footerCta,
            message: 'Footer CTA updated successfully'
        });
    } catch (error) {
        next(error);
    }
};
