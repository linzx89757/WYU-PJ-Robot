// 完全模拟手工评教的流程，默认评100分
// 全自动解放劳动力，只需要输入学号和密码登录
// 最后评教完成跳转到登录页方便开始下一个
(function () {
    var URLpath = {
        warning: "/xspj/zysx.htm", // 评教说明页
        teacherCourse: "/xspj/loadnevl.aspx", // 任课教师打分说明页
        teacher: "/xspj/evaluate.aspx", // 任课教师打分页
        tutorCourse: "/ds/loadnevl.asp", // 班导师（导师）打分说明页
        tutor:  "/ds/evaluate.asp" // 班导师（导师）打分页
    };

    if (location.pathname === URLpath.warning) {

        console.log("3.5s后自动点击·我已阅读·按钮");
        setTimeout('document.getElementById("btnSubmit").click()', 3500);
    }else if (location.pathname === URLpath.teacherCourse) {

        console.log("自动点击·下一页·按钮");
        document.getElementsByTagName("input")[2].click();
    }else if (location.pathname === URLpath.teacher) {

        // 任课教师开始打分
        var sel = document.getElementById("frmSel");
        for(var i = 3, j = 1; i < sel.length-3; i++, j++){
            var op = sel[i];
            op[1].selected = "selected"; // [0]是-,[1]是10,[2]是9...
            console.log("已为" + j + "个老师打分");
        }
        document.getElementById("frmSel").submit();
    }else if (location.pathname == URLpath.tutorCourse) {

        console.log("自动点击·下一页·按钮");
        location.href = "evaluate.asp";
    }else if (location.pathname == URLpath.tutor) {

        // 班导师（导师）开始打分
        var sel = document.getElementsByTagName("select");
        for(var i = 0, j = 1; i < sel.length; i++, j++){
            var op = sel[i];
            op[1].selected = "selected";
            console.log("已为" + j + "个导师打分");
        }
        frmSel.submit();
    }else{

        console.log("评教完成，跳转回登录页");
        location.href = "http://202.192.240.54/xspj/default1.aspx";
    }
})();