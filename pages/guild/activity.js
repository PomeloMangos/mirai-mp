const qv = require("../../utils/qv");
const moment = require("../../utils/moment");

Component({
    properties: {
        guild: null
    },

    data: {
        guild: null,
        status: 1,
        host: getApp().globalData.host,
        isFullScreen: getApp().globalData.isFullScreen,
        result: { data: [] }
    },

    methods: {
        changeStatusTab: function(event) {
            let status = event.currentTarget.dataset.status;
            this.setData({
                status: status
            });
            this.loadActivities(status);
        },
        loadActivities: function(status, page) {
            let self = this;
            qv.get(`${this.data.host}/api/activity?page=${page || 1}&status=${status}`).then(result => {
                let res = result.data;
                for (let i = 0; i < res.data.length; ++i) {
                    self.handleActivity(res.data[i]);
                }
                self.setData({
                    result: res
                });
            });
        },
        next: function() {
            let page = this.data.result.currentPage + 1;
            this.setData({
                'result.currentPage': page
            });

            var self = this;
            qv.get(`${this.data.host}/api/activity?page=${page + 1}&status=${this.data.status}`).then(result => {
                let res = result.data;
                for (let i = 0; i < res.data.length; ++i) {
                    self.handleActivity(res.data[i]);
                    self.data.result.data.push(res.data[i]);
                }
                self.setData({
                    'result.data': self.data.result.data
                });
            });
        },
        handleActivity: function(act) {
            act._firstRaid = act.raids.split(',')[0].trim();
            act._begin = moment(act.begin).format('MM月DD日 HH:mm');
        }
    },

    lifetimes: {
        attached: function() {
            this.setData({ guild: this.properties.guild });
            this.loadActivities(1);
        }
    }
})
