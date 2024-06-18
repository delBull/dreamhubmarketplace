const { find, getAggregate } = require("../../../helpers");
const { getDataWithLimit } = require("../../../helpers");
const { ObjectID } = require("../../../types");

function maxOfArray(array) {
  return Math.max.apply(Math, array);
}

function minOfArray(array) {
  return Math.min.apply(Math, array);
}

const allUsers = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 9;

    let skip = (page - 1) * limit;

    const apiData = await getDataWithLimit("user", {}, skip, limit);

    let tempArray = [];

    for (let index = 0; index < apiData.length; index++) {
      const obj = apiData[index]._doc;
      const totalData = await find("nft", { created_by: obj._id });
      console.log(totalData);
      let prices = totalData.map((obj) => Number(obj.actualPrice));
      let data = {
        ...obj,
        total: totalData.reduce(function (acc, obj) {
          return acc + Number(obj.actualPrice);
        }, 0),
        max: maxOfArray(prices),
        min: minOfArray(prices),
      };
      console.log(data.total);
      if (index === apiData.length - 1) {
        tempArray.push(data);
        return res.json({
          status: 200,
          msg: tempArray,
        });
      } else {
        tempArray.push(data);
      }
      // return data;
    }
  } catch (error) {
    return res.json({ status: 500, message: error.message });
  }
};

module.exports = allUsers;
