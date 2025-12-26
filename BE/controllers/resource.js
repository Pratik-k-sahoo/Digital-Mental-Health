const { Resource, ResourceUsage } = require("../models");
const { Op, where, Sequelize } = require("sequelize");

async function getResources(req, res) {
	try {
		const { category, tags, language, type, q, limit = 10, cursor } = req.query;

		const where = { isActive: true, isDeleted: false };
		if (category) where.category = category;
		if (type) where.type = type;
		if (language) where.language = language;
		if (tags) {
			console.log(tags);
			const tagArray = tags.split(",").map((t) => t.trim().toLowerCase());
			console.log(tagArray);
			where.tags = {
				[Op.contains]: tagArray,
			};
		}
		if (cursor)
			where.createdAt = {
				[Op.lt]: new Date(cursor),
			};
		if (q)
			where[Op.or] = [
				{ title: { [Op.iLike]: `%${q}%` } },
				{ description: { [Op.iLike]: `%${q}%` } },
			];

		const resources = await Resource.findAll({
			where,
			limit: Number(limit),
			order: [["createdAt", "DESC"]],
		});

		if (resources.length === 0) {
			return res.status(404).json({
				message: "No resources found.",
				resources,
			});
		}

		const nextCursor =
			resources.length > 0 ? resources[resources.length - 1].createdAt : null;

		res.status(200).json({
			message: "Resources found.",
			resources,
			nextCursor,
			hasMore: resources.length === Number(limit),
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function createResource(req, res) {
	console.log(req.body);
	try {
		const {
			title,
			category,
			type,
			description,
			url,
			language,
			tags,
			isActive,
		} = req.body;

		if (!title || !category || !type || !url || !language) {
			return res.status(400).json({
				message: "Enter valid details. All fields are required",
			});
		}

		let parsedTags = [];
		if (typeof tags === "string")
			parsedTags = tags
				.split(",")
				.map((tag) => tag.trim())
				.filter((tag) => tag.length > 0);
		else if (Array.isArray(tags))
			parsedTags = tags
				.map((tag) => String(tag).trim())
				.filter((tag) => tag.length > 0);

		parsedTags = [...new Set(parsedTags.map((tag) => tag.toLowerCase()))];

		const exists = await Resource.findOne({ where: { title, url } });
		if (exists) {
			return res.status(409).json({ message: "Resource already exists" });
		}

		const isResourceActive = isActive === false ? false : true;

		const resource = await Resource.create({
			title,
			category,
			type,
			description,
			url,
			language,
			tags: parsedTags,
			isActive: isResourceActive,
		});

		console.log(resource);

		res.status(201).json({
			message: "Resource addedd.",
			resource,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function updateResource(req, res) {
	try {
		const { id } = req.params;
		console.log(id);
		const resource = await Resource.findByPk(id);
		if (!resource)
			return res.status(404).json({
				message: "Resource not found",
				resource: [],
			});

		await resource.update(req.body);
		res.status(200).json({
			message: "Resource updated",
			resource,
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function deleteResource(req, res) {
	try {
		const { id } = req.params;
		console.log(id);
		const resource = await Resource.findByPk(id);
		if (!resource)
			return res.status(404).json({
				message: "Resource not found",
				resource: [],
			});

		resource.isDeleted = true;
		await resource.save();
		res.status(200).json({
			message: "Resource removed",
		});
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

async function resourceStats(req, res) {
	try {
		const stats = await Resource.findAll({
			attributes: [
				"id",
				"title",
				[
					Sequelize.fn("COUNT", Sequelize.col("ResourceUsage.id")),
					"usageCount",
				],
			],
			include: [
				{
					model: ResourceUsage,
					attributes: [],
				},
			],
			group: ["Resource.id"],
			order: [[Sequelize.literal("usageCount"), "DESC"]],
		});

		res.status(200).json({ message: "Resource stats", stats });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
}

module.exports = {
	getResources,
	createResource,
	updateResource,
	deleteResource,
	resourceStats,
};
