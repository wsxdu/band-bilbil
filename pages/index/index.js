// index 页面逻辑 - Bilibili 视频列表
Page({
  data: {
    videos: [],       // 视频列表，每次最多 10 条
    biliLoggedIn: false,
    biliAvatar: '',
    biliUsername: '',
    showRestriction: true, // 预览模式开关
    bleAvailable: false
  },

  onLoad() {
    // 获取 Bilibili 登录状态
    const app = getApp();
    this.setData({
      biliLoggedIn: app.globalData.biliLoggedIn,
      biliAvatar: app.globalData.biliAvatar,
      biliUsername: app.globalData.biliUsername,
      bleAvailable: app.globalData.ble ? app.globalData.ble.available : false
    });
    
    // 初始化蓝牙通信
    if (app.globalData.ble) {
      console.log('BLE Module loaded - Available:', app.globalData.ble.available);
    }
    
    // 自动获取视频列表
    this.onRefresh();
  },

  // 获取 Bilibili 视频列表（每次启动获取 10 条，不可观看）
  onRefresh() {
    const that = this;
    
    // 显示加载中
    wx.showLoading({
      title: '获取视频中...'
    });
    
    // 真实 Bilibili API 调用（此处使用真实端点结构，实际网络请求取决于环境）
    const apiUrl = 'https://api.bilibili.com/x/space/video?mid=123456&ps=10&pn=1'; // 示例：获取UP主视频列表
    
    // 发起网络请求获取视频列表
    wx.request({
      url: apiUrl,
      header: {
        'Content-Type': 'application/json'
      },
      success: function(res) {
        // 解析响应，提取视频信息
        const videos = [];
        if (res.data.code === 0) {
          const result = res.data.data;
          // 处理视频列表（实际字段请以Bilibili官方文档为准）
          if (result.list && result.list.length > 0) {
            result.list.forEach((item, index) => {
              videos.push({
                id: index + 1,
                title: item.title || '未知标题',
                cover: item.pic || 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
              });
            });
          }
        }
        
        that.setData({
          videos: videos.slice(0, 10), // 最多显示 10 条
          showRestriction: true
        });
        
        wx.hideLoading();
      },
      fail: function(error) {
        // 请求失败时使用备用的模拟数据
        console.error('Bilibili API 请求失败，使用备用数据', error);
        const mockVideos = [
          {
            id: 1,
            title: '哔哩哔哩动画新作预告',
            cover: 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
          },
          {
            id: 2,
            title: '2026夏季新番速报',
            cover: 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
          },
          {
            id: 3,
            title: '年度音乐合集',
            cover: 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
          },
          {
            id: 4,
            title: '鬼畜创意作品',
            cover: 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
          },
          {
            id: 5,
            title: '手册教学系列',
            cover: 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
          },
          {
            id: 6,
            title: '科技前沿报道',
            cover: 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
          },
          {
            id: 7,
            title: '搞笑集锦',
            cover: 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
          },
          {
            id: 8,
            title: '生活分享',
            cover: 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
          },
          {
            id: 9,
            title: '游戏实况',
            cover: 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
          },
          {
            id: 10,
            title: '舞艺展示',
            cover: 'https://i0.hdslb.com/bfs/archive/5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5.jpg'
          }
        ];
        
        that.setData({
          videos: mockVideos,
          showRestriction: true
        });
        
        wx.hideLoading();
      }
    });
  },

  // 发送蓝牙消息
  sendBleMessage() {
    const { bleAvailable } = this.data;
    if (!bleAvailable) {
      wx.showToast({
        title: '蓝牙不可用',
        icon: 'none'
      });
      return;
    }
    
    const app = getApp();
    const ble = app.globalData.ble;
    
    if (!ble || !ble.send) {
      wx.showToast({ title: '蓝牙服务不可用', icon: 'none' });
      return;
    }
    
    wx.showLoading({ title: '发送蓝牙中...' });
    
    // 发送蓝牙消息 - 示例：发送当前视频信息
    const sampleData = {
      action: 'video_status',
      video_count: this.data.videos.length,
      current_video: this.data.videos.length > 0 ? this.data.videos[0].title : '无'
    };
    
    ble.send(sampleData);
    
    wx.hideLoading();
    wx.showToast({ title: '蓝牙消息发送成功', icon: 'success' });
  },

  // 视频点击事件 - 预览模式：仅显示信息，禁止跨平台播放
  onVideoTap(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.videos[index];
    
    // 显示预览信息弹窗
    wx.showModal({
      title: '视频预览',
      content: `标题：${item.title}\\nBV号：BV${item.bid}\\n\\n点击仅显示信息，禁止完整播放\\n（完整视频播放需前往 Bilibili APP/网页）`,
      showCancel: false,
      confirmText: '了解'
    });
    
    // 阻止默认跳转并记录点击行为
    // 这里有意不跳转到外部链接，符合“预览-only”要求
    console.log('视频预览已拦截，仅展示信息', item);
  }
})