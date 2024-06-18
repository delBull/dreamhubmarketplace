// const nftViewImage = async (req, res) => {
//   try {
//     console.log("Some one hit");
//     const { filename } = req.params;
//     req.gfs.find({ filename }).toArray((err, files) => {
//       if (!files[0] || files.length === 0) {
//         return res.status(200).json({
//           success: false,
//           message: "No file available",
//         });
//       }
//       if (err) {
//         // render image to browser
//         return res.status(400).json({
//           message: err,
//         });
//       }
//       return req.gfs.openDownloadStreamByName(req.params.filename).pipe(res);
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send({ status: 400, message: err.message });
//   }
// };

// module.exports = nftViewImage;
