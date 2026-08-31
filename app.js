App({
  onLaunch() {
    // 初始化小米手环 7 连接
    this.initMiBand7();
    // 初始化 Bilibili 登录状态
    this.initBiliLogin();
    // 初始化蓝牙通信
    this.initBle();
    // 初始化 HTTP 遥控服务
    this.initHttpServer();
  },

  initMiBand7() {
    // TODO: 实现小米手环 7 SDK 初始化
    console.log('初始化小米手环 7');
  },

  initBle() {
    // 初始化蓝牙通信
    // 检测蓝牙能力 (Zeep/hmBle 专用)
    this.bleAvailable = typeof hmBle !== 'undefined';
    // 检查 App 能力 (Zeep/hmApp 专用)
    this.appAvailable = typeof hmApp !== 'undefined';
    console.log('BLE Available:', this.bleAvailable);
    console.log('App Available:', this.appAvailable);
    
    // 暴露 ble 对象到全局，供页面使用
    this.globalData.ble = {
      available: this.bleAvailable,
      appAvailable: this.appAvailable,
      send: function(data) {
        if (!this.available) {
          console.log('BLE not available');
          return;
        }
        if (this.appAvailable && hmApp && hmApp.send) {
          hmApp.send(JSON.stringify(data));
        } else {
          console.log('Sending ble data:', data);
        }
      }
    };
  },

  initHttpServer() {
    // 初始化 HTTP 遥控服务
    // 在 Zepp OS 1.0 环境中，手环本身不能联网，
    // HTTP 服务在 Zepp App (伴生服务) 中运行，端口 8765
    this.httpServer = {
      // 模拟 HTTP 服务状态
      isRunning: false,
      port: 8765,
      endpoints: ['/api/status', '/api/playlist', '/api/play', '/api/pause', '/api/toggle', '/api/next', '/api/prev'],
      // 模拟获取状态的方法 (在实际场景中由 Zepp App 处理)
      getStatus: function() {
        return {
          isPlaying: false,
          currentSong: '未知歌曲',
          progress: 0,
          totalDuration: 0
        };
      }
    };
    console.log('HTTP 遥控服务已初始化 (端口 8765 - Zepp App 内部)');
  },

  initBiliLogin() {
    // 从本地存储读取 Bilibili 登录状态
    const loginInfo = wx.getStorageSync('bili_login_info') || null;
    if (loginInfo) {
      this.globalData.biliLoggedIn = true;
      this.globalData.biliAvatar = loginInfo.avatar;
      this.globalData.biliUsername = loginInfo.username;
    }
  },

  globalData: {
    biliLoggedIn: false,
    biliAvatar: '',
    biliUsername: '',
    ble: null,
    httpServer: null
  }
})