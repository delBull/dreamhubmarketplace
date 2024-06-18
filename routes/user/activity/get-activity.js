const findAndSort = require("../../../helpers/index");

const getActivity = async (req, res) => {
  try {
    const user_id = req.params.id;
    if (!user_id.length)
      res.status(400).json({ statu: 400, message: "User id is required" });

    const checkUser = await findOne("user", { _id: user_id });
    if (!checkUser)
      return res.status(400).json({ status: 400, message: "user not found" });
    const activities = await findAndSort(
      "activity",
      { _id: user_id },
      { _id: -1 }
    );
    return res.status(200).json({ status: 200, data: activities });
  } catch (error) {
  
    return res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = getActivity;
