const { find } = require("../../../helpers/index");

const getPandorasEmails = async (req, res) => {
  try {
  
    const subscribers = await find("pandoras", {});
    return res.status(200).send({ status: 200, subscribers });
  } catch (e) {
    console.log(e);
    return res.status(500).send({ status: 500, message: e.message });
  }
};

module.exports = getPandorasEmails;
