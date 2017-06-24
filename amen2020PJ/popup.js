;(function() {
    'use stirct';

    // 获取background，与background通信
    var bg = chrome.extension.getBackgroundPage();
    
    // 左右滑动效果
    var turnFirstPageBtn = document.getElementById('turnFirstPageBtn'),
        turnSecondPage_1Btn = document.getElementById('turnSecondPage_1Btn'),
        turnSecondPage_2Btn = document.getElementById('turnSecondPage_2Btn'),
        turnThirdPage_1Btn = document.getElementById('turnThirdPage_1Btn'),
        turnThirdPage_2Btn = document.getElementById('turnThirdPage_2Btn'),
        turnFourthPageBtn = document.getElementById('turnFourthPageBtn'),
        page = document.getElementById('page');
    turnFirstPageBtn.addEventListener('click', function() {
        page.style.left = '0';
        bg.pageIndex = 1;
    }, false);
    turnSecondPage_1Btn.addEventListener('click', function() {
        page.style.left = '-300px';
        bg.pageIndex = 2;
    }, false);
    turnSecondPage_2Btn.addEventListener('click', function() {
        page.style.left = '-300px';
        bg.pageIndex = 2;
    }, false);
    turnThirdPage_1Btn.addEventListener('click', function() {
        page.style.left = '-600px';
        bg.pageIndex = 3;
    }, false);
    turnThirdPage_2Btn.addEventListener('click', function() {
        page.style.left = '-600px';
        bg.pageIndex = 3;
    }, false);
    turnFourthPageBtn.addEventListener('click', function() {
        page.style.left = '-900px';
        bg.pageIndex = 4;
    }, false);

    // 单独评分的辅助
    var teacherNameInput = document.getElementById('teacherNameInput'),
        teacherNameBtn = document.getElementById('teacherNameBtn'),
        teacherNameCancel = document.getElementById('teacherNameCancel'),
        scoreInput = document.getElementById('scoreInput'),
        scoreBtn = document.getElementById('scoreBtn'),
        shoukeTeacherBtn = document.getElementById('shoukeTeacherBtn'),
        bandaoTeacherBtn = document.getElementById('bandaoTeacherBtn');
    teacherNameBtn.addEventListener('click', function() {
        var teacherNameInputValue = teacherNameInput.value;
        if(teacherNameInputValue) {
            bg.teacherName = teacherNameInputValue;
            // 将用户输入的老师名字数组转化为json传送到background
            bg.getMsg(JSON.stringify(teacherNameInputValue.split(' ')));
        }
    }, false);
    teacherNameCancel.addEventListener('click', function() {
        teacherNameInput.value = '';
        bg.teacherName = '';
        bg.getMsg('cancel');
    }, false);
    scoreBtn.addEventListener('click', function() {
        var scoreInputValue = scoreInput.value;
        if(scoreInputValue) {
            bg.getMsg(11 - Number(scoreInputValue));
            scoreInput.value = '';
        }
    }, false);
    shoukeTeacherBtn.addEventListener('click', function() {
        // 将授课老师提交信号传送到background
        bg.getMsg('shouke');
    }, false);
    bandaoTeacherBtn.addEventListener('click', function() {
        // 将班导师提交信号传送到background
        bg.getMsg('bandao');
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
})();