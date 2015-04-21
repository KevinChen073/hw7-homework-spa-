# myHomework
MyHomework 是一个基于ExpressJS的Web 2.0应用，老师可以发布作业，学生可以提交作业。

## install & start development
1. install MonogoDB
2. run mongod (on default port 27017)
3. npm install
4. grunt watch

#角色: 学生，老师。
访问管理：
只有选定了本课程老师和学生才能够访问使用本系统。
老师可以看到所有的作业要求和所有学生提交的作业。
学生能看到所有的作业要求，但只能够看到自己的作业。
发布作业要求：老师可以发布作业要求，也可以修改一个已发布但是尚未截止的作业要求。
提交作业：学生可以提交作业（可以多次提交作业，系统将保留最新的版本）。
deadline：老师可以设定修改作业要求的截止时间，截止时间到达后，任何学生都将无法提交作业。
作业评分: 截止时间到达之后，老师可以批改作业给出分数。

#技术搭建
基于B\S架构的多页应用
后端：NodeJS+MonogoDB
Node Package:见package.json
