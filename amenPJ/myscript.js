// 完全模拟手工评教的流程，默认评100分
// 全自动解放劳动力，只需要输入学号和密码登录
// 最后评教完成跳转到登录页方便开始下一个
// 6.0版：可以单独对某一个老师进行手动评分
//  需要在登录前打开控制台，使用localStorage缓存老师的名字，保存为json数组
(function () {

    var URLpath = {
            warning: "/xspj/zysx.htm", // 评教说明页
            teacherCourse: "/xspj/loadnevl.aspx", // 任课教师打分说明页
            teacher: "/xspj/evaluate.aspx", // 任课教师打分页
            tutorCourse: "/ds/loadnevl.asp", // 班导师（导师）打分说明页
            tutor:  "/ds/evaluate.asp" // 班导师（导师）打分页
        },
        teacherName = localStorage.getItem('teacherName');

    if (location.pathname === URLpath.warning) {

        console.log("3.5s后自动点击·我已阅读·按钮");
        setTimeout(function() {

            document.getElementById("btnSubmit").click();
        }, 3500);
    }else if (location.pathname === URLpath.teacherCourse) {

        console.log("自动点击·下一页·按钮");
        document.getElementsByTagName("input")[2].click();
    }else if (location.pathname === URLpath.teacher) {

        // 检索老师名字
        var teacherID = document.getElementById("lblRKJS").textContent;
        pipeiTeacher(teacherID, shoukeTeacher);
        
    }else if (location.pathname == URLpath.tutorCourse) {

        console.log("自动点击·下一页·按钮");
        location.href = "evaluate.asp";
    }else if (location.pathname == URLpath.tutor) {

        // 检索老师名字
        var table = document.getElementsByTagName("table")[1],
            tr = table.getElementsByTagName("tr")[0],
            td = tr.getElementsByTagName("td")[1],
            b = td.getElementsByTagName("b")[0],
            teacherID = b.innerText;
        pipeiTeacher(teacherID, bandaoTeacher);
    }else{

        console.log("评教完成，跳转回登录页，同时清了缓存");
        localStorage.removeItem('teacherName');
        location.href = "http://202.192.240.54/xspj/default1.aspx";
    }

    // 授课教师打分
    function shoukeTeacher() {
        
        var sel = document.getElementById("frmSel");
        for(var i = 3, j = 1; i < sel.length-3; i++, j++){
            var op = sel[i];
            op[1].selected = "selected"; // [0]是-,[1]是10,[2]是9...
        }
        document.getElementById("frmSel").submit();
    }
    // 班导师（导师）打分
    function bandaoTeacher() {

        var sel = document.getElementsByTagName("select");
        for(var i = 0, j = 1; i < sel.length; i++, j++){
            var op = sel[i];
            op[1].selected = "selected";
        }
        frmSel.submit();
    }
    // 匹配出需要单独评分的老师
    function pipeiTeacher(teacherID, teacherFn) {
        if(teacherName === null) {

            // 不需要单独评分，开始评分
            teacherFn();
        }else{

            // 需要单独评分，开始匹配
            var teacherNameArr = JSON.parse(teacherName),
                arrLength = teacherNameArr.length;
            for(var i = 0; i < arrLength; i++) {

                if(teacherID === teacherNameArr[i]) {

                    console.log(teacherID + "，匹配正确，请开始评教，评完后请手动提交！");
                    break;
                }else if(i === arrLength - 1){
                    
                    console.log('匹配失败，班导师开始打分');
                    teacherFn();
                }
            }
        }
    }
})();