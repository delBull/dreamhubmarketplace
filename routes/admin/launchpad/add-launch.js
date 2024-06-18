const Joi = require("joi");
const { updateDocument, findOne } = require("../../../helpers");

const schema = Joi.object({
    projectName: Joi.string().required(),
    projectWebsite: Joi.string().required(),
    projectTwitter: Joi.string().required(),
    projectDiscord: Joi.string().required(),
    projectDescription: Joi.string().required(),
    roadmap: Joi.string(),
    projectGoals: Joi.string(),
    discordID: Joi.string(),
    contactEmail: Joi.string(),
    content: Joi.string(),
    teamInformation: Joi.string(),
    affiliationCompanies: Joi.string(),
    projectInvestment: Joi.string(),
    contractAddress: Joi.string().required(),
    contractType: Joi.string().required(),
    artworkSamples: Joi.string(),
    expectedMintDate: Joi.string().required(),
    mintSupply: Joi.string(),
    artMarketplace: Joi.string().required(),
    dreamhubDox: Joi.string(),
    mintFunds: Joi.string().required(),
    additionalInformation: Joi.string(),
    status: Joi.string(),
});
const schemaForId = Joi.object({
    id: Joi.string().required(),
});

const addLaunch = async (req, res) => {
    try {
        await schemaForId.validateAsync(req.params);
        await schema.validateAsync(req.body);
        const { id } = req.params;

        const findLaunchpad = await findOne("launchPad", { _id: id });

console.log(findLaunchpad,"findLaunchpad....");

        if (!findLaunchpad) {
            return res.status(404).send({ status: 404, message: "No Launchpad found" });
        }
        const launchpad = await updateDocument(
            "launchPad",
            {
                _id: id,
            },
            {
                ...req.body,
            }
        );

console.log(launchpad,"launchpad");

        return res
            .status(200)
            .send({ status: 200, message: "Launchpad accepted successfully" ,launchpad});
    } catch (e) {
        console.log(e);
        return res.status(500).send({ status: 500, message: e.message });
    }
};

module.exports = addLaunch;