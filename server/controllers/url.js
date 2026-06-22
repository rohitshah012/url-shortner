const { URL } = require("../models/url");
const { nanoid } = require("nanoid");

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ msg: "url is required" });
    }

    try {
        const shortId = nanoid(8);

        await URL.create({
            Shortid: shortId,
            RedirectUrl: body.url,
            VisitHistory: [],
            Createdby : req.user._id
        });

        // Redirect to home page instead of rendering to avoid form resubmission on refresh
        return res.redirect("/");
    } catch (error) {
        return res.status(500).json({ msg: "failed to create short url" });
    }
}

async function handleShowUrlAnalytics(req, res) {
    const shortId = req.params.nanoid;

    try {
        const Result = await URL.findOne({ Shortid: shortId });

        if (!Result) {
            return res.status(404).json({ msg: "short url not found in Database " });
        }

        return res.json({
            totalClicks: Result.VisitHistory.length,
            analytics: Result.VisitHistory,
        });
    } catch (error) {
        return res.status(500).json({ msg: "failed to fetch analytics" });
    }
}

async function handleRedirectUrl(req, res) {
    const shortId = req.params.nanoid;

    try {
        const entry = await URL.findOneAndUpdate(
            {
                Shortid: shortId,
            },
            {
                $push: {
                    VisitHistory: {
                        timestamp: new Date().toLocaleString(),
                    },
                },
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ msg: "short url not found" });
        }

        return res.redirect(entry.RedirectUrl);
    } catch (error) {
        return res.status(500).json({ msg: "failed to redirect" });

    }
};

async function handleShowAllShortUrl(req, res) {
    try {
        const allShortUrls = await URL.find({});

        if (!allShortUrls || allShortUrls.length === 0) {
            return res.status(404).json({ msg: "no short urls found" });
        }

        const urlList = allShortUrls.map(url => ({
            shortId: url.Shortid,
            redirectUrl: url.RedirectUrl,
            totalClicks: url.VisitHistory.length,
        }));

        return res.json(urlList);
    } catch (error) {
        return res.status(500).json({ msg: "failed to fetch short urls" });
    }
}


async function handleDeleteShortURL(req, res) {
    const shortId = req.params.nanoid;

    try {
        const url = await URL.findOne({ Shortid: shortId });

        if (!url) {
            return res.status(404).json({ msg: "Short URL not found" });
        }

        // Check if the user owns this URL
        if (url.Createdby.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: "You don't have permission to delete this URL" });
        }

        await URL.deleteOne({ Shortid: shortId });

        return res.redirect("/");
    } catch (error) {
        return res.status(500).json({ msg: "Failed to delete short URL" });
    }
}

module.exports = {
    handleGenerateNewShortURL,
    handleShowUrlAnalytics,
    handleRedirectUrl,
    handleShowAllShortUrl,
    handleDeleteShortURL,
};
