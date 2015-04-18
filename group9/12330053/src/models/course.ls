require! ['mongoose']

module.exports = mongoose.model 'Course', {
	id: String,
	CourseName: String,
	describe: String,
	deadline: String,
}