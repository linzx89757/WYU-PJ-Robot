;(function() {
    'use strict';

    // 获取background，可以直接访问background的全局变量
    var bg = chrome.extension.getBackgroundPage(),
        page = document.getElementById('page'),
        teacherNameInput = document.getElementById('teacherNameInput'),
        scoreInput = document.getElementById('scoreInput'),
        pageTurnData = [
            {
                domId: 'turnFirstPageBtn',
                pxs: '0',
                pageIndex: 1
            },
            {
                domId: 'turnSecondPage_1Btn',
                pxs: '-300px',
                pageIndex: 2
            },
            {
                domId: 'turnSecondPage_2Btn',
                pxs: '-300px',
                pageIndex: 2
            },
            {
                domId: 'turnThirdPage_1Btn',
                pxs: '-600px',
                pageIndex: 3
            },
            {
                domId: 'turnThirdPage_2Btn',
                pxs: '-600px',
                pageIndex: 3
            },
            {
                domId: 'turnFourthPageBtn',
                pxs: '-900px',
                pageIndex: 4
            }
        ];

    /**
     * 添加点击事件
     * @param {string} id DOM节点的id
     * @param {function} fn 点击后需要触发的操作
     */
    function addClickEvent(domId, fn) {
        document.getElementById(domId).addEventListener('click', fn, false);
    }

    // 页面左右滑动效果
    pageTurnData.forEach(function(item) {
        addClickEvent(item.domId, function() {
            page.style.left = item.pxs; // 页面开始滑动
            bg.pageIndex = item.pageIndex; // 记录当前页码
        });
    });

    // 处理单独评分
    addClickEvent('teacherNameBtn', function() {
        var teacherName = teacherNameInput.value;
        if(teacherName) {
            bg.teacherName = teacherName; // 记录需要单独评分的老师名字
            // 将用户输入的老师名字数组转化为json字符串并借助background传送到content
            bg.getMsg(JSON.stringify(teacherName.split(' ')));
        }
    });
    addClickEvent('teacherNameCancel', function() {
        teacherNameInput.value = '';
        bg.teacherName = ''; // 清除已记录的需要单独评分的老师名字
        bg.getMsg('cancel'); // 将取消单独评分的信号借助background传送到content
    });
    addClickEvent('scoreBtn', function() {
        var score = scoreInput.value;
        if(score) {
            bg.score = score; // 记录一键评分的分数
            // 将一键评分的分数转化为数字并借助background传送到content
            bg.getMsg(Number(score));
        }
    });
    addClickEvent('shoukeTeacherBtn', function() {
        bg.getMsg('shouke'); // 将授课老师提交信号借助background传送到content
    });
    addClickEvent('bandaoTeacherBtn', function() {
        bg.getMsg('bandao'); // 将班导师提交信号借助background传送到content
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
})();