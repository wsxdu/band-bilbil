// 设置页面逻辑
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    // Bilibili 登录相关
    biliLoggedIn: false,
    biliAvatar: '',
    biliUsername: ''
  },

  onLoad() {
    // 检查 Bilibili 登录状态
    const app = getApp();
    const loginInfo = wx.getStorageSync('bili_login_info');
    if (loginInfo) {
      this.setData({
        biliLoggedIn: true,
        biliAvatar: loginInfo.avatar,
        biliUsername: loginInfo.username
      });
    }
  },

  // 获取用户信息
  getUserInfo(e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
    }
  },

  // Bilibili 登录
  bindBiliLogin() {
    // 跳转到登录页或打开登录二维码
    wx.showModal({
      title: 'Bilibili 登录',
      content: '请在手机端打开 Bilibili APP 扫码登录',
      showCancel: false,
      confirmText: '确定'
    });
  },

  // 退出登录
  bindBiliLogout() {
    wx.removeStorageSync('bili_login_info');
    const app = getApp();
    app.globalData.biliLoggedIn = false;
    app.globalData.biliAvatar = '';
    app.globalData.biliUsername = '';
    this.setData({
      biliLoggedIn: false,
      biliAvatar: '',
      biliUsername: ''
    });
    wx.showToast({ title: '已退出登录', icon: 'success' });
  }
})