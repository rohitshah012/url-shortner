const { URL } = require("../models/url");
const { nanoid } = require("nanoid");
const { URL: NodeURL } = require("url");

async function handleGenerateNewShortURL(req, res) {
    const rawUrl = req.body.url?.trim();

    if (!rawUrl) {
        return res.status(400).render("home", {
            error: "A destination URL is required.",
            urls: [],
            user: req.user,
            baseUrl: `${req.protocol}://${req.get("host")}`,
        });
    }

    try {
        const destination = new NodeURL(rawUrl);
        if (!["http:", "https:"].includes(destination.protocol)) {
            throw new Error("Unsupported URL protocol");
        }

        const shortId = nanoid(8);

        await URL.create({
            Shortid: shortId,
            RedirectUrl: destination.toString(),
            VisitHistory: [],
            Createdby : req.user._id
        });

        return res.redirect(`/?created=${encodeURIComponent(shortId)}`);
    } catch (error) {
        if (error.message === "Invalid URL" || error.message === "Unsupported URL protocol") {
            const urls = await URL.find({ Createdby: req.user._id }).sort({ createdAt: -1 });
            return res.status(400).render("home", {
                error: "Enter a valid URL beginning with http:// or https://.",
                urls,
                user: req.user,
                baseUrl: `${req.protocol}://${req.get("host")}`,
            });
        }

        return res.status(500).send("Failed to create the short URL.");
    }
}

async function handleShowUrlAnalytics(req, res) {
    const shortId = req.params.nanoid;

    try {
        const query = { Shortid: shortId };
        if (req.user.role !== "ADMIN") {
            query.Createdby = req.user._id;
        }

        const Result = await URL.findOne(query);

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
                        timestamp: new Date(),
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
        const query = req.user.role === "ADMIN" ? {} : { Createdby: req.user._id };
        const allShortUrls = await URL.find(query).sort({ createdAt: -1 });

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
        const isOwner = url.Createdby?.toString() === req.user._id.toString();
        if (req.user.role !== "ADMIN" && !isOwner) {
            return res.status(403).json({ msg: "You don't have permission to delete this URL" });
        }

        await URL.deleteOne({ Shortid: shortId });

        return res.status(204).end();
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
