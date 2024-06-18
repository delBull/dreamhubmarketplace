const { deleteDocument } = require("../../../helpers/index");
const Joi = require("joi");
const saveActivity = require('../../../middleware/activity/save-activity')

const schema = Joi.object({
  email: Joi.string().email().required(),
});


const pandoras_Unsubscribe = async (req, res) => {
  const { email } = req.body;
  try {
    const validate = await schema.validateAsync(req.body);
    const deleteQuery = { email };
    let response = await deleteDocument("pandoras", deleteQuery);
    saveActivity(req, res,  `User ${email} pandoras unsubscribed email successfully`);
    return res.status(200).send({ status: 200, response });
  } catch (e) {
    res.status(400).send({ status: 400, message: e.message });
  }
};

module.exports = pandoras_Unsubscribe;