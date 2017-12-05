;(function() {
    'use stirct';

    // 获取background，与background通信
    var bg = chrome.extension.getBackgroundPage();
    
    // 左右滑动效果
    var page = document.getElementById('page');
    addClickEvent('turnFirstPageBtn', function() {
        page.style.left = '0';
        bg.pageIndex = 1; // 记录正在浏览的页码
    });
    addClickEvent('turnSecondPage_1Btn', function() {
        page.style.left = '-300px';
        bg.pageIndex = 2;
    });
    addClickEvent('turnSecondPage_2Btn', function() {
        page.style.left = '-300px';
        bg.pageIndex = 2;
    });
    addClickEvent('turnThirdPage_1Btn', function() {
        page.style.left = '-600px';
        bg.pageIndex = 3;
    });
    addClickEvent('turnThirdPage_2Btn', function() {
        page.style.left = '-600px';
        bg.pageIndex = 3;
    });
    addClickEvent('turnFourthPageBtn', function() {
        page.style.left = '-900px';
        bg.pageIndex = 4;
    });

    // 单独评分
    var teacherNameInput = document.getElementById('teacherNameInput'),
        scoreInput = document.getElementById('scoreInput');
    addClickEvent('teacherNameBtn', function() {
        var teacherName = teacherNameInput.value;
        if(teacherName) {
            bg.teacherName = teacherName; // 记录需要单独评分的老师名字
            // 将用户输入的老师名字数组转化为json字符串并传送到background
            bg.getMsg(JSON.stringify(teacherName.split(' ')));
        }
    });
    addClickEvent('teacherNameCancel', function() {
        teacherNameInput.value = '';
        bg.teacherName = ''; // 清除已记录的需要单独评分的老师名字
        bg.getMsg('cancel'); // 将取消单独评分的信号传送到background
    });
    addClickEvent('scoreBtn', function() {
        var score = scoreInput.value;
        if(score) {
            bg.score = score; // 记录一键评分的分数
            // 将一键评分的分数转化为数字并传送到background
            bg.getMsg(Number(score));
        }
    });
    addClickEvent('shoukeTeacherBtn', function() {
        bg.getMsg('shouke'); // 将授课老师提交信号传送到background
    });
    addClickEvent('bandaoTeacherBtn', function() {
        bg.getMsg('bandao'); // 将班导师提交信号传送到background
    });

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

    
    /**
     * 添加点击事件
     * @param {string} id DOM节点的id
     * @param {function} fn 点击后需要触发的操作
     */
    function addClickEvent(domId, fn) {
        document.getElementById(domId).addEventListener('click', fn, false);
    }
})();