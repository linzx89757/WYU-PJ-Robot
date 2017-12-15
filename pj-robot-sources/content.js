;(function() {
    'use strict';

    // 与background连接，建立通信通道
    var contentToBg = chrome.runtime.connect({name: 'contentToBg'}),
        URLpath = {
            default: '/xspj/default1.aspx', // 登陆页
            warning: '/xspj/zysx.htm', // 评教说明页
            shoukePage: '/xspj/loadnevl.aspx', // 授课老师打分说明页
            shouke: '/xspj/evaluate.aspx', // 授课老师打分页
            bandaoPage: '/ds/loadnevl.asp', // 班导师打分说明页
            bandao:  '/ds/evaluate.asp' // 班导师打分页
        },
        pathname = location.pathname,
        teacherName = localStorage.getItem('teacherName'); // 缓存单独评分的老师名字

    /**
     * 授课老师自动打分并提交，如果是一键评分则不自动提交
     * @param {number} score 一键评分的分数0~10
     */
    function shoukeTeacherMark(score) {
        var sel = document.getElementById('frmSel');
        for(var i = 3, j = 1; i < sel.length-3; i++, j++) {
            var op = sel[i];
            // [0]是-，[1]是10，[2]是9...
            op[score? 11 - score: 1].selected = 'selected';
        }
        if(!score) { // 如果是一键评分则不自动提交
            document.getElementById('frmSel').submit();
        }
    }

    /**
     * 班导师自动打分并提交，如果是一键评分则不自动提交
     * @param {number} score 一键评分的分数0~10
     */
    function bandaoTeacherMark(score) {
        var sel = document.getElementsByTagName('select');
        for(var i = 0, j = 1; i < sel.length; i++, j++) {
            var op = sel[i];
            // [0]是-，[1]是10，[2]是9...
            op[score? 11 - score: 1].selected = 'selected';
        }
        if(!score) { // 如果是一键评分则不自动提交
            frmSel.submit();
        }
    }

    /**
     * 匹配出需要单独评分的老师
     * @param {json string or null} teacherName 需要单独匹配的老师名字
     * @param {string} teacherID 检索到的老师名字
     * @param {function} teacherMark 打分程序
     */
    function teacherMatch(teacherName, teacherID, teacherMark) {
        if(!teacherName) {
            // 不需要单独评分，开始自动打分并提交
            teacherMark();
        }else{
            // 需要单独评分，开始匹配并执行打分程序
            var teacherNameArr = JSON.parse(teacherName),
                arrLength = teacherNameArr.length;
            for(var i = 0; i < arrLength; i++) {
                if(teacherID === teacherNameArr[i]) {
                    console.log(teacherID + '，匹配正确，请开始评分，评完后请手动提交！');
                    break;
                }else if(i === arrLength - 1) {
                    console.log('匹配失败，开始自动打分');
                    teacherMark();
                }
            }
        }
    }

    // 监听来自background的连接，建立通信通道
    chrome.runtime.onConnect.addListener(function(port) {
        // 监听通信通道消息传输，msg为消息对象，msg.value为消息内容
        port.onMessage.addListener(function(msg) {
            // 处理单独评分
            if(msg.value === 'shouke') {
                // 授课老师提交
                document.getElementById('frmSel').submit();
            }else if(msg.value === 'bandao') {
                // 班导师提交
                frmSel.submit();
            }else if(msg.value === 'cancel') {
                // 取消单独评分，清除缓存
                localStorage.removeItem('teacherName');
            }else if(typeof msg.value === 'number') {
                // 一键评分
                if(pathname === URLpath.shouke) {
                    shoukeTeacherMark(msg.value);
                }else if(pathname === URLpath.bandao) {
                    bandaoTeacherMark(msg.value);
                }
            }else{
                // 需要单独评分，缓存老师名字
                localStorage.setItem('teacherName', msg.value);
            }
        });
    });

    // 开始全自动评分
    if(pathname === URLpath.warning) {
        console.log('3.5s后自动点击·我已阅读·按钮');
        setTimeout(function() {
            document.getElementById('btnSubmit').click();
        }, 3500);
    }else if(pathname === URLpath.shoukePage) {
        console.log('自动点击·下一页·按钮');
        document.getElementsByTagName('input')[2].click();
    }else if(pathname === URLpath.shouke) {
        // 检索老师名字
        var teacherID = document.getElementById('lblRKJS').textContent;
        teacherMatch(teacherName, teacherID, shoukeTeacherMark);
    }else if(pathname === URLpath.bandaoPage) {
        console.log('自动点击·下一页·按钮');
        location.href = URLpath.bandao;
    }else if(pathname === URLpath.bandao) {
        // 检索老师名字
        var table = document.getElementsByTagName('table')[1],
            tr = table.getElementsByTagName('tr')[0],
            td = tr.getElementsByTagName('td')[1],
            b = td.getElementsByTagName('b')[0],
            teacherID = b.innerText;
        teacherMatch(teacherName, teacherID, bandaoTeacherMark);
    }else if(pathname !== URLpath.default) {
        console.log('评教完成，跳转回登录页，同时清了缓存');
        contentToBg.postMessage({value: 'ok'}); // 利用通道传送评教成功的消息
        localStorage.removeItem('teacherName');
        location.href = URLpath.default;
    }
})();