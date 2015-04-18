var express=require("express"),router=express.Router(),Course=require("../models/course"),User=require("../models/user"),Upload=require("../models/upload"),courseHandle=require("../course/handler"),isAuthenticated=function(e,o,r){return e.isAuthenticated()?r():void o.redirect("/")};module.exports=function(e){return router.get("/",function(e,o){o.render("index",{message:e.flash("message")})}),router.get("/addHw",function(e,o){o.render("add",{message:e.flash("add")})}),router.post("/score",function(e,o){var r=e.query.uploadId,s=e.body.score;Upload.update({_id:r},{score:s},function(e){if(e)throw console.log("Error in Saving user: "+e),e;console.log("User Registration succesful")}),o.redirect("/home")}),router.get("/upload",function(e,o){console.log(e.query.id),User.findOne({_id:e.query.id}).exec(function(e,r){Course.find().exec(function(e,s){console.log(r),o.render("upload",{courses:s,schoolId:r.schoolId,student:r.username})})})}),router.get("/modify",function(e,o){var r=e.query.id;Course.findOne({_id:r}).exec(function(r,s){o.render("modify",{message:e.flash("modify"),course:s})})}),router.post("/login",e.authenticate("login",{successRedirect:"/home",failureRedirect:"/",failureFlash:!0})),router.post("/registerCourse",function(e,o){var r=e.body.CourseName,s=e.body.describe,u=e.body.deadline,n=new Course;n.CourseName=r,n.deadline=u,n.describe=s,n.save(function(e){e&&o.json({msg:"注册失败"}),o.json({msg:"完成注册"})})}),router.post("/modifyCourse",function(e,o){var r=e.body.CourseName,s=e.body.describe,u=e.body.deadline,n=e.query.id;Course.update({_id:n},{CourseName:r,describe:s,deadline:u},function(e){if(e)throw console.log("Error in Saving user: "+e),e;console.log("User Registration succesful")}),o.redirect("/home")}),router.post("/upload",function(e,o){var r=new Date,s=new Upload;Course.findOne({CourseName:e.body.course}).exec(function(u,n){s.deadline=n.deadline,s.uploadDate=r,s.schoolId=e.body.schoolId,s.student=e.body.student,s.course=e.body.course,s.homework=e.body.homework,s.save(function(e){e&&o.json({msg:"上交失败"}),o.json({msg:"完成上传作业"})})})}),router.post("/signup",e.authenticate("signup",{successRedirect:"/home",failureRedirect:"/signup",failureFlash:!0})),router.get("/home",isAuthenticated,function(e,o){var r=Date.now(),s=new Date;Course.find().exec(function(u,n){Upload.find().exec(function(u,t){for(var d in t){var i=r-Date.parse(t[d].deadline);t[d].timeout=i?!1:!0}o.json({user:e.user,courses:n,uploads:t,date:s})})})}),router.get("/signout",function(e,o){e.logout(),o.redirect("/")}),router};