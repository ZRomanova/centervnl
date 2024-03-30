const Base = require('../models/answers')
const errorHandler = require('../utils/errorHandler')

module.exports.getAnswer = async function (req, res) {
    try {
        const data = await Base.aggregate(
            [
                { $match: { $text: { $search: req.body.message } } },
                { $sort: { score: { $meta: "textScore" } } },
                { $project: { _id: 0, keywords: 0 } }
            ]
        )

        res.status(200).json(data)
    } catch (e) {
        console.log(e)
        errorHandler(res, e)
    }
}