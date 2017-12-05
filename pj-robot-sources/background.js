window.pageIndex = 0; // 记录正在浏览的页码
window.teacherName = ''; // 记录需要单独评分的老师名字
window.score = '';// 记录一键评分的分数

// chrome只能暴露在最外面
// 获取当前tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // 与content连接，建立通信通道，指定并命名tabId
    var bgToContent = chrome.tabs.connect(tabId, {name: 'bgToContent'});
    // 利用通道传送来自popup的消息
    window.getMsg = function(msg) {
        bgToContent.postMessage({value: msg});
    };
});

// 监听连接，单独评分
chrome.extension.onConnect.addListener(function(port) {
    // 监听通信通道，msg为消息对象
    port.onMessage.addListener(function(msg) {
        if(msg.value === 'ok') {
            window.teacherName = '';
            window.score = '';
        }
    });
});