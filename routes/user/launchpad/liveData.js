const { find } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const selectedTimeData = async (req, res) => {
  try {
    const { time } = req.body;

       const launchpad = await find("launchPad");

    // 1 Day = 86400 Seconds

    // totalTime Calcualte

    const timeDuration = launchpad.filter(
      (data) => data.startTime + Number(data.presaleDuration) * 86400000
    );

    // live Users
    const live = launchpad.filter(
      (data) => data.startTime < time
      //  data.startTime + Number(data.presaleDuration) * 86400000 > time
    );

    // Upcoming Users
    const upComing = timeDuration.filter((data) => data.startTime > time);

    // Past Users
    const past = timeDuration.filter(
      (data) => data.startTime + Number(data.presaleDuration) * 86400000 < time
    );

    if (!live || !upComing || !past) {
      return res.status(200).send({ status: 400, msg: "No Data Found" });
    }

    return res.status(200).send({ status: 200, live, upComing, past });
  } catch (e) {
    return res.status(400).send({ status: 500, message: e.message });
  }
};

module.exports = selectedTimeData;
