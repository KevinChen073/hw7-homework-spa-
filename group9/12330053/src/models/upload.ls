require! ['mongoose']

module.exports = mongoose.model 'Upload', {
	id: String,
	schoolId: String,
	student: String,
	course: String,
	deadline: String,
	score: String,
	homework: String,
	uploadDate: String
}