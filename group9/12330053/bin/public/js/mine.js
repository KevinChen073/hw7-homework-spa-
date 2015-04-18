var indexContent = $("#index");
var addContent = $("#add");
var registerContent = $("#register");
var homeContent = $("#home");
var uploadContent = $("#upload");
addContent.hide();
registerContent.hide();
homeContent.hide();
uploadContent.hide();
$("#msg").hide();
var animateTime = 400;

var User = function(){
	var that = this;
	that.id = ko.observable();
	that.schoolId = ko.observable();
	that.username = ko.observable();
	that.password = ko.observable();
	that.email = ko.observable();
	that.firstName = ko.observable();
	that.lastName = ko.observable();
	that.role = ko.observable();
}
var Course = function(){
	var that = this;
	that.id = ko.observable();
	that.CourseName = ko.observable();
	that.describe = ko.observable();
	that.deadline = ko.observable();
}
var Upload = function(){
	var that = this;
	that.schoolId = ko.observable();
}

var showMessage = function(msg){
	$("#msg").show(animateTime);
	$("#message").html(msg);
	setTimeout(function(){
		$("#msg").hide(animateTime)
	},3000);
}

var viewModel = function(){
	var that = this;
	that.curUser = ko.observable(new User());
	//signin page
	that.username = ko.observable();
	that.pwd = ko.observable();

	//register page
	that.reg_username = ko.observable();
	that.reg_schoolId = ko.observable();
	that.reg_password = ko.observable();
	that.reg_email = ko.observable();
	that.reg_firstName = ko.observable();
	that.reg_lastName = ko.observable();

	//home page
	that.home_courses = ko.observableArray();
	that.home_date = ko.observable();
	that.home_uploads = ko.observableArray();
	that.fullName = ko.computed(function(){
		return that.curUser().firstName+that.curUser().lastName;
	})

	//RegisterCourse page
	that.regC_courseName = ko.observable();
	that.regC_describe = ko.observable();
	that.regC_deadline = ko.observable();

	//Upload page
	that.upload_schoolId = ko.computed(function(){
		return that.curUser().schoolId;
	});
	that.upload_student = ko.computed(function(){
		return that.fullName();
	});
	that.upload_course = ko.observableArray();

	that.upload_homework = ko.observable();

	//function
	that.addPage = function(){
		addContent.show(animateTime);
	}
	that.uploadPage = function(){
		uploadContent.show(animateTime);
	}
	that.closeUpload = function(){
		uploadContent.hide(animateTime);
	}
	that.closeAdd = function(){
		addContent.hide(animateTime);
	}
	that.postUpload = function(){
		$.post("/upload",
			{schoolId:that.upload_schoolId,
				student:that.upload_student,
				course:that.upload_course,
				homework:that.upload_homework},
			function(data){
			 	showMessage(data.msg);
			 	that.signin();
			 	that.closeUpload();
			 });
	}
	that.postRegister = function(){
		$.post("/registerCourse",
			{CourseName:that.regC_courseName,
				describe:that.regC_describe,
				deadline:that.regC_deadline
			},
			 function(data){
			 	showMessage(data.msg);
			 	that.signin();
			 	that.closeAdd();
			 });
	}
	var updateHomePage = function(data){
		that.home_courses(data.courses);
		that.home_date(data.date);
		that.home_uploads(data.uploads);
		that.curUser(data.user);
		that.upload_course([]);

		for (var k in that.home_courses()){
			$("#select").append($("<option>"+that.home_courses()[k].CourseName+"</option>"));
		}

		if (that.curUser().role == "teacher"){
			$(".teacherPage").show();
			$(".studentPage").hide();
		}else{
			$(".studentPage").show();
			$(".teacherPage").hide();
		}

		var courseList = $("#courseList tbody");
		courseList.empty();
		for (var k in that.home_courses()){
			var newTr = $("<tr></tr>");
			newTr.append($("<td>"+that.home_courses()[k].CourseName+"</td>"));
			newTr.append($("<td>"+that.home_courses()[k].describe+"</td>"));
			newTr.append($("<td>"+that.home_courses()[k].deadline+"</td>"));
			courseList.append(newTr);
		}

		var uploadList = $("#uploadList tbody");
		uploadList.empty();
		for (var k in that.home_uploads()){
			var newTr = $("<tr></tr>");
			newTr.append($("<td>"+that.home_uploads()[k].schoolId+"</td>"));
			newTr.append($("<td>"+that.home_uploads()[k].student+"</td>"));
			newTr.append($("<td>"+that.home_uploads()[k].course+"</td>"));
			newTr.append($("<td>"+that.home_uploads()[k].uploadDate+"</td>"));
			newTr.append($("<td>"+that.home_uploads()[k].score+"</td>"));
			uploadList.append(newTr);
		}


	}
	that.signin = function(){
		$.post("/login",
			{username:that.username(),password:that.pwd()},
			function(data){
				updateHomePage(data);
				indexContent.hide(animateTime);
				homeContent.show(animateTime);
			}
		);
	}
	that.finishRegister = function(){
		$.post("/signup",
				{
					username:that.reg_username(),
					schoolId:that.reg_schoolId(),
					password:that.reg_password(),
					email:that.reg_email(),
					firstName:that.reg_firstName(),
					lastName:that.reg_lastName()},
				function(data){
					updateHomePage(data);
					registerContent.hide(animateTime);
					homeContent.show(animateTime);
				});
	}
	that.signout = function(){
		homeContent.hide(animateTime);
		indexContent.show(animateTime);
	}
	that.register = function(){
		indexContent.hide(animateTime);
		registerContent.show(animateTime);
	}
}

ko.applyBindings(new viewModel());