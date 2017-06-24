;(function() {
    'use stirct';

    var URLpath = {
            default: '/xspj/default1.aspx', // 登陆页
            warning: '/xspj/zysx.htm', // 评教说明页
            teacherCourse: '/xspj/loadnevl.aspx', // 任课教师打分说明页
            teacher: '/xspj/evaluate.aspx', // 任课教师打分页
            tutorCourse: '/ds/loadnevl.asp', // 班导师（导师）打分说明页
            tutor:  '/ds/evaluate.asp' // 班导师（导师）打分页
        },
        pathname = location.pathname,
        teacherName = localStorage.getItem('teacherName');

    // 与background连接，建立通信通道，指定并命名tabId
    var contentToBg = chrome.extension.connect({name: "contentToBg"});

    // 监听连接，辅助单独评分
    chrome.extension.onConnect.addListener(function(port) {
        // 监听通信通道，msg为消息对象
        port.onMessage.addListener(function(msg) {
            if(msg.value === 'shouke') {
                document.getElementById('frmSel').submit();
            }else if(msg.value === 'bandao') {
                frmSel.submit();
            }else if(msg.value === 'cancel') {
                localStorage.removeItem('teacherName');
            }else if(typeof msg.value === 'number') {
                if(pathname === URLpath.teacher) {
                    shoukeTeacher(msg.value);
                }else if(pathname == URLpath.tutor) {
                    bandaoTeacher(msg.value);
                }
            }else{
                localStorage.setItem('teacherName', msg.value);
            }
        });
    });

    // 开始全自动评分
    if (pathname === URLpath.warning) {
        console.log('3.5s后自动点击·我已阅读·按钮');
        setTimeout(function() {
            document.getElementById('btnSubmit').click();
        }, 3500);
    }else if (pathname === URLpath.teacherCourse) {
        console.log('自动点击·下一页·按钮');
        document.getElementsByTagName('input')[2].click();
    }else if (pathname === URLpath.teacher) {
        // 检索老师名字
        var teacherID = document.getElementById('lblRKJS').textContent;
        pipeiTeacher(teacherID, shoukeTeacher);
    }else if (pathname == URLpath.tutorCourse) {
        console.log('自动点击·下一页·按钮');
        location.href = 'evaluate.asp';
    }else if (pathname == URLpath.tutor) {
        // 检索老师名字
        var table = document.getElementsByTagName('table')[1],
            tr = table.getElementsByTagName('tr')[0],
            td = tr.getElementsByTagName('td')[1],
            b = td.getElementsByTagName('b')[0],
            teacherID = b.innerText;
        pipeiTeacher(teacherID, bandaoTeacher);
    }else if(pathname != URLpath.default){
        console.log('评教完成，跳转回登录页，同时清了缓存');
        contentToBg.postMessage({value: "ok"}); // 利用通道传送评教成功的消息
        localStorage.removeItem('teacherName');
        location.href = URLpath.default;
    }

    // 授课教师打分
    function shoukeTeacher(score) {
        var sel = document.getElementById('frmSel');
        for(var i = 3, j = 1; i < sel.length-3; i++, j++){
            var op = sel[i];
            op[score? score: 1].selected = 'selected'; // [0]是-,[1]是10,[2]是9...
        }
        document.getElementById('frmSel').submit();
    }
    // 班导师（导师）打分
    function bandaoTeacher(score) {
        var sel = document.getElementsByTagName('select');
        for(var i = 0, j = 1; i < sel.length; i++, j++){
            var op = sel[i];
            op[score? score: 1].selected = 'selected';
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
                    console.log(teacherID + '，匹配正确，请开始评教，评完后请手动提交！');
                    break;
                }else if(i === arrLength - 1){
                    console.log('匹配失败，班导师开始打分');
                    teacherFn();
                }
            }
        }
    }
})();