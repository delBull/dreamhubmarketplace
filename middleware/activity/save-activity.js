const { insertNewDocument } = require("../../helpers");

const saveActivity = async (req, res, action) => {
  try {

    //console.log("helllll.....")
    
    const activity = await insertNewDocument("activity", {
      user_id: req.userId,
      date: new Date().getTime(),
      action,
    });
//  res.status(200).json({status: 200, message: activity});
//     console.log(activity,"eeeeeee");
   req?.io?.to(req.userId).emit("activity", activity);
    //  console.log("2");
    return;
    // return res.status(200).json({status: 200, message:action});
  } catch (e) {
    console.log(e);
    // return res.status(500).json({ status: 500, message: e.message });
    return;
  }
};

module.exports = saveActivity;
