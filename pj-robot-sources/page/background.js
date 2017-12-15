;(function() {
    'use strict';

    // 设置扩展程序徽章
    chrome.browserAction.setBadgeText({text: 'PJ'});

    window.pageIndex = 0; // 记录当前页码
    window.teacherName = ''; // 记录需要单独评分的老师名字
    window.score = '';// 记录一键评分的分数

    // 监听标签页更新，获取当前标签页
    chrome.tabs.onUpdated.addListener(function(tabId) {
        // 与content连接，建立通信通道
        var bgToContent = chrome.tabs.connect(tabId, {name: 'bgToContent'});
        // 利用通道传送来自popup的消息
        window.getMsg = function(msg) {
            bgToContent.postMessage({value: msg});
        };
    });

    // 监听来自content的连接，建立通信通道
    chrome.runtime.onConnect.addListener(function(port) {
        // 监听通信通道消息传输，msg为消息对象，msg.value为消息内容
        port.onMessage.addListener(function(msg) {
            // 处理评教成功后的操作
            if (msg.value === 'ok') {
                window.teacherName = '';
                window.score = '';
            }
        });
    });
})();