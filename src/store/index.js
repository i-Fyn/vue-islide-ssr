// stores/main.js
import { defineStore } from 'pinia';
import axios from '@/dist/axios';
import { SelfStorage } from '@/dist/persistedState'


export const useStore = defineStore('main', {
  state: () => ({
    theme: 'light',
    themeColor: '',
    token: '',
    ref: '',
    article: {},
    moment: {},
    homeMoudle: [],
    postList: {},
    menus: [],
    emojiList: [],
    loginSettings: {},
    userInfo: {},
    userInfoList: {},
    widgets: {},
    taxonomy: {},
    title: 'God Blog',
    summary: {},
    page_links: {},
    post_footer_action: {},
    author_stats: {},
    config: {},
    circleSideBar: {},
    circleData: {},
    hotTopics: [],
    hotCircles: [],
    hotArticles: [],
    postPage: {},
    downloadData: {},
    pageContentLoading: true,
    apiLoad: {},
    loading: false,
    loaded: false,
    isLoadStyle: false,
    center_title: '',
    videoList: {},
    prenextList: {},
    commentList: {},
    topicDataList: {},
    apiPostData: {},
    apiGetData: {},
    isCheckIn: false,
    noticeList: [],
    vipInfo: {},
    userVerifyInfo: {},
    verifyInfo: {},
    lastLoadTime: 0,
    modalOpen: false,
    siteStats: {},
    showLogin: false,
    userAgent: '',
    normal_module: true,
    friend_rss: [],
  }),

  actions: {
    async fetchFriendRss(data) {
      try {
        let key = Object.values(data).join('-');  
        if (this.friend_rss[key]) {
          return this.friend_rss[key];
        }
        const response = await axios.post('/getFriendsArticles',data);
        this.friend_rss[key] = response.data;
        return response.data;
      } catch (error) {
      }
    },
    //homePage
    async fetchHomeData() {
      if (!this.config || !this.config.islide_template_index) return [];
      const requests = Object.values(this.config.islide_template_index)
        .filter(value =>
          (value.module_type === 'posts' || value.module_type == 'hometop') &&
          value.module_mobile_show !== 3
        )
        .map(value => {
          const param = {
            size: value.post_count,
            cat_id: (value.module_type === 'posts' || value.module_type == 'hometop') ? value.post_cat : value.video_cat,
            type: value._post_type,
            sort: value.post_order
          };
          return this.getList(param);
        });
      return Promise.all(requests);
    },
    async fetchVerifyData() {
      await Promise.all([
        this.fetchUserVerifyInfo(),
        this.fetchVerifyInfo(),
      ]);
    },
    async fetchSiteStats() {
      try {
        if (Object.keys(this.siteStats).length > 0) {
          return this.siteStats;
        }
        const response = await axios.get('/site-stats');
        this.siteStats = response.data;
        return response.data;
      } catch (error) {
      }
    },
    async fetchVipInfo() {
      try {
        if (Object.keys(this.vipInfo).length > 0) {
          return this.vipInfo;
        }
        const response = await axios.post('/getVipInfo');
        this.vipInfo = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchUserVerifyInfo() {
      try {
        if (Object.keys(this.userVerifyInfo).length > 0) {
          return this.userVerifyInfo;
        }
        const response = await axios.post('/getUserVerifyInfo');
        this.userVerifyInfo = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchVerifyInfo() {
      try {
        if (Object.keys(this.verifyInfo).length > 0) {
          return this.verifyInfo;
        }
        const response = await axios.post('/getVerifyInfo');
        this.verifyInfo = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchArticle(articleId) {
      try {
        const response = await axios.get(`/detail/posts?id=${articleId}`);
        return response.data;
      } catch (error) {

      }
    },
    async fetchNoticeList() {
      if (this.noticeList.length > 0) {
        return this.noticeList;
      }
      try {
        const response = await axios.post('/getNewNoticeList', {
          "count": 3
        });
        this.noticeList = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchApiPostData(api, data) {
      try {
        const response = await axios.post('/' + api, data);
        return response.data;
      } catch (error) {

      }
    },
    async fetchApiGetData(api, data) {
      const key = api + '-' + Object.values(data).join('-');
      if (this.apiGetData[key]) {
        return this.apiGetData[key];
      }
      try {
        const response = await axios({
          method: 'get',
          url: '/' + api,
          params: data
        });
        this.apiGetData[key] = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchTopicData(topic_id) {
      try {
        const response = await axios.post('getTopicData', {
          topic_id: topic_id
        });
        return response.data;
      } catch (error) {

      }
    },
    async fetchCommentList(data) {
      const key = Object.values(data).join('-');
      if (this.commentList[key]) {
        return this.commentList[key];
      }
      try {
        const response = await axios.post('/getCommentList', data);
        this.commentList[key] = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchPrenextList(articleId) {
      if (this.prenextList[articleId]) {
        return this.prenextList[articleId];
      }
      try {
        const response = await axios.get('/post/prenext?id=' + articleId);
        this.prenextList[articleId] = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchVideoList(articleId) {
      try {
        const response = await axios.post('getVideoList', `post_id=${articleId}`);
        return response.data;
      } catch (error) {

      }
    },
    async fetchDownloadData(articleId) {
      if (this.downloadData[articleId]) {
        return this.downloadData[articleId];
      }
      try {
        const response = await axios.post('getDownloadData', {
          post_id: articleId
        });
        this.downloadData[articleId] = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchMoment(momentId) {
      try {
        const response = await axios.get(`/detail/moments?id=${momentId}`);
        return response.data;
      } catch (error) {

      }
    },
    async fetchHotArticles() {
      try {
        const response = await axios.post('/posts', {
          "paged": 1,
          "size": "6",
          "sort": "views",
          "type": "post"
        });
        return response.data;
      } catch (error) {

      }
    },
    async fetchHotCircles(refresh = false) {
      if (this.hotCircles.length > 0 && !refresh) {
        return this.hotCircles;
      }
      try {
        const response = await axios.get('/getHotCircleData');
        this.hotCircles = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchHotTopics(refresh = false) {
      if (this.hotTopics.length > 0 && !refresh) {
        return this.hotTopics;
      }
      try {
        const response = await axios.get('/getHotTopicData');
        this.hotTopics = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchCircleData(circle_id) {
      try {
        const response = await axios.post('/getCircleData', {
          circle_id,
        });
        return response.data;
      } catch (error) {

      }
    },
    async fetchCircleSideBar(tax) {
      if (this.circleSideBar[tax]) {
        return this.circleSideBar[tax];
      }
      try {
        const response = await axios.get('/circle/sidebar?tax=' + tax);
        this.circleSideBar[tax] = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchConfig() {
      try {
        const response = await axios.get('/config');
        console.log(response.data);
        this.config = response.data;
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchAuthorStats(id) {
      if (this.author_stats[id]) {
        return this.author_stats[id];
      }
      try {
        const response = await axios.get('/author/stats?id=' + id);
        this.author_stats[id] = response.data;
        return response.data;
      } catch (error) {

      }
    },
    async fetchPageLinks() {
      try {
        const response = await axios.get('/page/links');
        this.page_links = response.data;
        return response.data;
      } catch (error) {

      }
    },

    async fetchSummary(articleId) {
      if (this.summary[articleId]) {
        return this.summary[articleId].summary;
      }
      try {
        const response = await axios.get(`/deepseek/summary?id=${articleId}`);
        this.summary[articleId] = response.data;
        return response.data.summary;
      } catch (error) {

      }
    },

    async fetchTaxonomy(id) {
      if (this.taxonomy[id]) {
        return this.taxonomy[id];
      }
      try {
        const response = await axios.get(`/detail/taxonomy?id=${id}`);
        this.taxonomy[id] = response.data;
        return response.data;
      } catch (error) {

      }
    },

    async fetchUserInfo(id) {
      try {
        let url = '/user';
        if (id) {
          url = '/user?id=' + id;
        }
        const response = await axios.get(url);
        if (id) {
          this.userInfoList[id] = response.data;
        } else {
          this.userInfo = response.data;
        }
        return response.data;
      } catch (error) {

      }
    },

    async fetchLoginOut() {
      try {
        await axios.get('/loginOut');
        this.userInfo = {};
        localStorage.removeItem('token');
      } catch (error) {

      }
    },

    async fetchLoginSettings() {
      if (this.loginSettings.login_text) {
        return this.loginSettings;
      }
      try {
        const response = await axios.get('/getLoginSettings');
        this.loginSettings = response.data;
        return response.data;
      } catch (error) {

      }
    },

    async fetchEmojiList() {
      if (this.emojiList.length > 0) {
        return this.emojiList;
      }
      try {
        const response = await axios.post('/getEmojiList');
        this.emojiList = response.data.list;
        return response.data.list;
      } catch (error) {

      }
    },

    async fetchMenus() {
      if (Object.keys(this.menus).length > 0) {
        return this.menus;
      }
      try {
        const response = await axios.get('/getMenus');
        this.menus = response.data;
        return response.data;
      } catch (error) {

      }
    },

    async fetchHomeMoudle() {
      if (this.homeMoudle.length > 0) {
        return this.homeMoudle;
      }
      try {
        const response = await axios.get('/getIndexModules');
        this.homeMoudle = response.data;
        return response.data;
      } catch (error) {

      }
    },

    async getList(data) {
      //处理data的键值对顺序
      const sortedData = Object.keys(data).sort().reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
      const key = Object.values(sortedData).map(v => typeof v === 'object' ? JSON.stringify(v) : v).join('-');
      if (this.postList[key]) {
        console.log(this.postList[key].data.length);
        return this.postList[key];
      }
      try {
        const _data = {
          cat_id: data.cat_id || 0,
          paged: data.paged || 1,
          size: data.size || 10,
          sort: data.sort || 'date',
          tag_id: data.tag_id || 0,
          metas: data.metas || {},
          type: data.type || 'post',
          date: data.date || '',
        };

        if (_data.cat_id === 0) delete _data.cat_id;
        if (_data.tag_id === 0) delete _data.tag_id;
        if (_data.metas.meta_key && _data.metas.meta_value) _data.metas = _data.metas;
        if (!_data.metas.meta_key || !_data.metas.meta_value) delete _data.metas;
        if (_data.date === '') delete _data.date;

        const response = await axios.post('/posts', _data);
        this.postList[key] = response.data;
        return response.data;
      } catch (error) {

      }
    },
  },

  persist: [
    {
      key: 'hot',
      pick: ['hotArticles', 'hotCircles', 'hotTopics'],
      storage: {
        setItem: (key, value) => SelfStorage.setItem(key, value, { expires: 0 }),
        getItem: (key) => SelfStorage.getItem(key),
        removeItem: (key) => SelfStorage.removeItem(key)
      }
    },
    {
      key: 'config',
      pick: ['config'],
      storage: {
        setItem: (key, value) => SelfStorage.setItem(key, value, { expires: '1d' }),
        getItem: (key) => SelfStorage.getItem(key),
        removeItem: (key) => SelfStorage.removeItem(key)
      }
    },
    {
      key: 'emoji',
      pick: ['emojiList'],
      storage: {
        setItem: (key, value) => SelfStorage.setItem(key, value, { expires: 0 }),
        getItem: (key) => SelfStorage.getItem(key),
        removeItem: (key) => SelfStorage.removeItem(key)
      }
    },
    {
      key: 'theme',
      pick: ['theme','normal_module'],
      storage: {
        setItem: (key, value) => SelfStorage.setItem(key, value, { expires: 0 }),
        getItem: (key) => SelfStorage.getItem(key),
        removeItem: (key) => SelfStorage.removeItem(key)
      }
    },
    {
      key: 'ref',
      pick: ['ref'],
      storage: {
        setItem: (key, value) => SelfStorage.setItem(key, value, { expires: 0 }),
        getItem: (key) => SelfStorage.getItem(key),
        removeItem: (key) => SelfStorage.removeItem(key)
      }
    }

  ]


});

