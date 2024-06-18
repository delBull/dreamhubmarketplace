const { findOne, find } = require("../../../helpers");
const { ObjectID } = require("../../../types");

const randomlivedata = async (req, res) => {
  try {
    const { time } = req.body;
    const launchpad = await find("launchPad");

    // 1 Day = 86400 Seconds

    // totalTime Calcualte
    const timeDuration = launchpad.filter(
      (data) => data.startTime + Number(data.presaleDuration) * 86400000
    );

    console.log(timeDuration, "timeDuration");

    // live Users
    const live = launchpad.filter(
      (data) =>
        data.startTime < time &&
        data.startTime + Number(data.presaleDuration) * 86400000 > time
    );

    const data = live.slice(0, 4);

    console.log(live, "live");

    if (!live) {
      return res.status(200).send({ status: 400, msg: "No Live Data Found" });
    }

    return res.status(200).send({ status: 200, data });
  } catch (e) {
    return res.status(400).send({ status: 500, message: e.message });
  }
};

module.exports = randomlivedata;
