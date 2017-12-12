;(function() {
    'use strict';

    // 设置扩展程序徽章
    chrome.browserAction.setBadgeText({text: 'PJ'});

    window.pageIndex = 0; // 记录当前页码
    window.teacherName = ''; // 记录需要单独评分的老师名字
    window.score = '';// 记录一键评分的分数

    // 获取当前tab
    chrome.tabs.onUpdated.addListener(function(tabId) {
        // 与content连接，建立通信通道
        var bgToContent = chrome.tabs.connect(tabId, {name: 'bgToContent'});
        // 利用通道传送来自popup的消息
        window.getMsg = function(msg) {
            bgToContent.postMessage({value: msg});
        };
    });

    // 监听连接，单独评分
    chrome.runtime.onConnect.addListener(function(port) {
        // 监听通信通道，msg为消息对象
        port.onMessage.addListener(function(msg) {
            if (msg.value === 'ok') {
                window.teacherName = '';
                window.score = '';
            }
        });
    });
})();