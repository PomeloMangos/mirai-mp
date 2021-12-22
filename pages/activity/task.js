Component({
    properties: {
        activity: null
    },

    data: {
        activity: null,
        host: getApp().globalData.host,
        isFullScreen: getApp().globalData.isFullScreen,
        canBack: false,
        groups: []
    },

    methods: {
        onBackBtnClicked: function () {
            wx.navigateBack();
        }
    },

    lifetimes: {
        attached: function () {
            let activity = this.properties.activity;

            // 处理任务玩家
            console.warn(activity.tasks);
            for (let i = 0; i < activity.tasks.groups.length; ++i) {
                let taskGroup = activity.groups.tasks[i];
                for (let j = 0; j < taskGroup.groups.tasks; ++j) {
                    let task = taskGroup.tasks[j];
                    let players = [];
                    for (let k = 0; k < task.players.length; ++k) {
                        let reg = activity.registrations.filter(x => x.id == task.players[k].id);
                        if (reg.length) {
                            players.push(reg[0]);
                        }
                    }
                    task.players = players;
                }
            }

            this.setData({
                activity: activity,
                canBack: !!wx.$guild
            });
        }
    }
})
