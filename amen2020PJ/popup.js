;(function() {
    'use stirct';

    // 获取background，与background通信
    var bg = chrome.extension.getBackgroundPage();
    
    // 左右滑动效果
    var page = document.getElementById('page');
    document.getElementById('turnFirstPageBtn').addEventListener('click', function() {
        page.style.left = '0';
        bg.pageIndex = 1; // 记录正在浏览的页码
    }, false);
    document.getElementById('turnSecondPage_1Btn').addEventListener('click', function() {
        page.style.left = '-300px';
        bg.pageIndex = 2;
    }, false);
    document.getElementById('turnSecondPage_2Btn').addEventListener('click', function() {
        page.style.left = '-300px';
        bg.pageIndex = 2;
    }, false);
    document.getElementById('turnThirdPage_1Btn').addEventListener('click', function() {
        page.style.left = '-600px';
        bg.pageIndex = 3;
    }, false);
    document.getElementById('turnThirdPage_2Btn').addEventListener('click', function() {
        page.style.left = '-600px';
        bg.pageIndex = 3;
    }, false);
    document.getElementById('turnFourthPageBtn').addEventListener('click', function() {
        page.style.left = '-900px';
        bg.pageIndex = 4;
    }, false);

    // 单独评分
    var teacherNameInput = document.getElementById('teacherNameInput'),
        scoreInput = document.getElementById('scoreInput');
    document.getElementById('teacherNameBtn').addEventListener('click', function() {
        var teacherName = teacherNameInput.value;
        if(teacherName) {
            bg.teacherName = teacherName; // 记录需要单独评分的老师名字
            // 将用户输入的老师名字数组转化为json并传送到background
            bg.getMsg(JSON.stringify(teacherName.split(' ')));
        }
    }, false);
    document.getElementById('teacherNameCancel').addEventListener('click', function() {
        teacherNameInput.value = '';
        bg.teacherName = ''; // 清除已记录的需要单独评分的老师名字
        bg.getMsg('cancel'); // 将取消单独评分的信号传送到background
    }, false);
    document.getElementById('scoreBtn').addEventListener('click', function() {
        var score = scoreInput.value;
        if(score) {
            bg.score = score; // 记录一键评分的分数
            // 将一键评分的分数转化为数字并传送到background
            bg.getMsg(Number(score));
        }
    }, false);
    document.getElementById('shoukeTeacherBtn').addEventListener('click', function() {
        bg.getMsg('shouke'); // 将授课老师提交信号传送到background
    }, false);
    document.getElementById('bandaoTeacherBtn').addEventListener('click', function() {
        bg.getMsg('bandao'); // 将班导师提交信号传送到background
    }, false);

    // 显示上次浏览的页面数据
    switch(bg.pageIndex) {
        case 1:
            page.style.left = '0';
            break;
        case 2:
            page.style.left = '-300px';
            break;
        case 3:
            page.style.left = '-600px';
            break;
        case 4:
            page.style.left = '-900px';
            break;
        // 不需要设置default
    }
    teacherNameInput.value = bg.teacherName;
    scoreInput.value = bg.score;
})();