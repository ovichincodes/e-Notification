const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const readXlsxFile = require("read-excel-file/node");
const router = express.Router();
const auth = require("../middleware/auth");
const Cryptr = require("cryptr");
// init cryptr with the secret key
const cryptr = new Cryptr(process.env.CRYPTR_SECRET);

// models
const Result = require("../models/Result");
const UploadedResult = require("../models/UploadedResult");

// Set the Storage Engine
const storage = multer.diskStorage({
	destination: "./public/uploads",
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

// Init the upload which calls the storage engine above
const upload = multer({
	storage: storage,
	limits: { fileSize: 5000000 }, // 5MB
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
}).single("file");

// check file type
checkFileType = (file, cb) => {
	// allowed Extensions
	const fileTypes = /xls|xlsb|xlsm|xlsx|xlt/;
	// check extension
	const extname = fileTypes.test(
		path.extname(file.originalname).toLowerCase()
	);
	// check if extname and mimetype are true
	return extname
		? cb(null, true)
		: cb({ message: "Error: Only Excel Files are allowed!" });
};

// @route	GET lecturers/uploadedResults
// @desc	Get all uploaded results
// @access	Private
router.route("/uploadedResults").get(auth, (req, res) => {
	UploadedResult.find({}, null, { sort: { level: 1 } })
		.populate("course", null, null)
		.populate("department", null, null)
		.populate("session", null, null)
		.populate("results", null, null)
		.exec()
		.then((uploadedResults) =>
			res.status(200).json({ isCompleted: true, msg: uploadedResults })
		)
		.catch((err) =>
			res.status(200).json({
				isCompleted: false,
				msg: "Error: " + err,
			})
		);
});

// @route	GET lecturers/results/:id
// @desc	Get the results of a single course
// @access	Private
router.route("/results/:id").get(auth, (req, res) => {
	let { id } = req.params;
	Result.find({ uploadedResult: id })
		.populate("uploadedResult", null, null)
		.then((results) => {
			res.status(200).json({
				isCompleted: true,
				msg: results,
			});
		})
		.catch((err) => {
			res.status(200).json({
				isCompleted: false,
				msg: err,
			});
		});
});

// @route	POST lecturers/upload
// @desc	Upload results
// @access	Private
router.post("/upload", auth, (req, res) => {
	// first upload the excel file to the public folder
	upload(req, res, (err) => {
		if (err) {
			res.status(200).json({
				isCompleted: false,
				lastUploaded: null,
				msg: err,
			});
		} else {
			// check if this course has been uploaded in this session
			// for this level and department in the same semester
			UploadedResult.find({
				course: req.body.course,
				department: req.body.department,
				level: req.body.level,
				semester: req.body.semester,
				session: req.body.session,
			})
				.then((uploadedResults) => {
					if (uploadedResults.length > 0) {
						res.status(200).json({
							isCompleted: false,
							lastUploaded: null,
							msg:
								"This Result already exist for this course, department, level, semester and session!",
						});
					} else {
						// read excel file
						readXlsxFile(
							path.join(
								path.dirname(path.basename(__dirname)),
								"public/uploads",
								req.file.filename
							)
						).then((rows) => {
							// delete the excel file after getting all the rows
							fs.unlink(
								path.join(
									path.dirname(path.basename(__dirname)),
									"public/uploads",
									req.file.filename
								),
								(err) => {
									if (err) {
										res.status(200).json({
											isCompleted: false,
											lastUploaded: null,
											msg: err,
										});
									} else {
										if (rows[0].length != 8) {
											res.status(200).json({
												isCompleted: false,
												lastUploaded: null,
												msg:
													"Contents of this file are not formatted properly!",
											});
										} else {
											if (
												rows[0][0].toLowerCase() !==
													"s/n" ||
												rows[0][1].toLowerCase() !==
													"name" ||
												rows[0][2].toLowerCase() !==
													"registration number" ||
												rows[0][3].toLowerCase() !==
													"quiz" ||
												rows[0][4].toLowerCase() !==
													"exam" ||
												rows[0][5].toLowerCase() !==
													"total" ||
												rows[0][6].toLowerCase() !==
													"grade" ||
												rows[0][7].toLowerCase() !==
													"remark"
											) {
												res.status(200).json({
													isCompleted: false,
													lastUploaded: null,
													msg:
														"Contents of this file are not formatted properly!",
												});
											} else {
												// get the lecturer id
												let lec_id = req.user_id;
												// destructure req.body
												let {
													course,
													department,
													level,
													semester,
													session,
												} = req.body;
												// insert the uploaded result
												let resultFile = new UploadedResult(
													{
														course,
														department,
														level,
														semester,
														session,
														lecturer: lec_id,
													}
												);
												resultFile
													.save()
													.then(() => {
														// get the recently uploaded result file id
														let id = resultFile._id;
														for (
															let row = 1;
															row < rows.length;
															row++
														) {
															// insert the read excel file into the result collection
															let result = new Result();
															result.name =
																rows[row][1];
															result.regno =
																rows[row][2];
															result.quizScore =
																rows[row][3];
															result.examScore =
																rows[row][4];
															result.totalScore =
																rows[row][5];
															result.grade =
																rows[row][6];
															result.remark =
																rows[row][7];
															result.uploadedResult = id;
															result.save(
																(err) => {
																	if (err) {
																		res.status(
																			200
																		).json({
																			isCompleted: false,
																			lastUploaded: null,
																			msg:
																				"Error: " +
																				err,
																		});
																	} else {
																		// get the last uploaded result file by id
																		// and and read result id to the result array
																		// of the uploaded result file collection
																		UploadedResult.findById(
																			id
																		)
																			.then(
																				(
																					lastResultFile
																				) => {
																					lastResultFile.results.push(
																						result._id
																					);
																					lastResultFile.save();
																				}
																			)
																			.catch(
																				(
																					err
																				) =>
																					res
																						.status(
																							200
																						)
																						.json(
																							{
																								isCompleted: false,
																								lastUploaded: null,
																								msg:
																									"Error: " +
																									err,
																							}
																						)
																			);
																	}
																}
															);
														}
														// return success message and the last uploaded result file
														UploadedResult.findById(
															id
														)
															.populate(
																"results",
																null,
																null
															)
															.populate(
																"course",
																null,
																null
															)
															.populate(
																"department",
																null,
																null
															)
															.populate(
																"session",
																null,
																null
															)
															.exec(
																(
																	err,
																	resFile
																) => {
																	require("../config/email")(
																		{
																			title:
																				resFile
																					.course
																					.title,
																			code:
																				resFile
																					.course
																					.code,
																			level:
																				resFile.level,
																		}
																	);
																	require("../config/sms")(
																		{
																			title:
																				resFile
																					.course
																					.title,
																			code:
																				resFile
																					.course
																					.code,
																			level:
																				resFile.level,
																		}
																	);
																	res.status(
																		200
																	).json({
																		isCompleted: true,
																		lastUploaded: resFile,
																		msg: `${resFile.course.title} ${resFile.course.code} Uploaded Successfully!`,
																	});
																}
															);
													})
													.catch((err) =>
														res.status(200).json({
															isCompleted: false,
															lastUploaded: null,
															msg:
																"Error: " + err,
														})
													);
											}
										}
									}
								}
							);
						});
					}
				})
				.catch((err) => {
					res.status(200).json({
						isCompleted: false,
						lastUploaded: null,
						msg: err,
					});
				});
		}
	});
});

/*
	@route	DELETE lecturers/results/uploaded/delete/:id
	@desc	Delete an uploaded result
	@access	Private
*/
router.route("/results/uploaded/delete/:id").delete(auth, (req, res) => {
	let { id } = req.params;
	UploadedResult.findById(id)
		.then((uploadedResult) => {
			// get the id of the students linked to this course result
			const resids = uploadedResult.results;
			if (resids.length > 0) {
				// loop trough the ids and delete all
				for (i = 0; i < resids.length; i++) {
					Result.deleteOne({ _id: resids[i] }, (err) => {
						if (err) {
							res.status(200).json({
								isCompleted: false,
								msg: "Error: " + err,
							});
						}
					});
				}
			}
			// after deleting, delete the main course result
			uploadedResult
				.remove()
				.then(() => {
					res.status(200).json({
						isCompleted: true,
						msg: "Result Deleted Successfully!",
					});
				})
				.catch((err) => {
					res.status(200).json({
						isCompleted: false,
						msg: "Error: " + err,
					});
				});
		})
		.catch((err) =>
			res.status(200).json({ isCompleted: false, msg: "Error: " + err })
		);
});

// @route	GET lecturers/results/delete/:resid/:uplresid
// @desc	Delete a student's results from the results collection
// @access	Private
router.route("/results/delete/:resid/:uplresid").delete(auth, (req, res) => {
	// resid is the id of the student in the results collection to be deleted
	// uplresid is the id of the course in the uploadedResults collection
	// wherein the results array contains the resid
	let { resid, uplresid } = req.params;
	// remove the id of the std to be deleted from the results array
	// in the uploadedResults collection
	UploadedResult.updateOne(
		{ _id: uplresid },
		{
			$pull: {
				results: {
					$in: [resid],
				},
			},
		},
		(err) => {
			if (err) {
				res.status(200).json({
					isCompleted: false,
					msg: "Error: " + err,
				});
			} else {
				Result.findByIdAndDelete(resid)
					.then(() =>
						res.status(200).json({
							isCompleted: true,
							msg: "Result Deleted Successfully!",
						})
					)
					.catch((err) =>
						res
							.status(200)
							.json({ isCompleted: false, msg: "Error: " + err })
					);
			}
		}
	);
});

module.exports = router;
