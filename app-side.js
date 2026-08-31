(() => {
  // 蓝牙通信核心模块 - 基于 PymChat 1.0.5 结构适配
  const ble = {
    // 检查蓝牙能力 (Zeep/hmBle 专用)
    available: typeof hmBle !== 'undefined',
    
    // 检查 App 能力 (Zeep/hmApp 专用)
    appAvailable: typeof hmApp !== 'undefined',
    
    // 发送消息到手环
    send: function(data) {
      if (!this.available) {
        console.log('BLE not available');
        wx.showToast({ title: '蓝牙不可用', icon: 'none' });
        return;
      }
      if (this.appAvailable && hmApp && hmApp.send) {
        hmApp.send(JSON.stringify(data));
      } else {
        console.log('Sending ble data:', data);
      }
    },
    
    // 设置消息回调
    setCallback: function(callback) {
      // 可以在这里设置全局消息回调
      console.log('BLE callback set');
    }
  };
  
  // 暺露到全局，供小程序页面使用
  const app = getApp();
  app.ble = ble;
  
  console.log('BLE Module Loaded - Available:', ble.available);
})();