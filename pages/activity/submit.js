const qv = require("../../utils/qv");

Component({
    properties: {
        activity: null
    },

    data: {
        activity: null,
        host: getApp().globalData.host,
        isFullScreen: getApp().globalData.isFullScreen,
        canBack: false,
        myCharacters: [],
        name: '',
        newCharacter: {
            name: '',
            class: 0,
            realm: null
        },
        ui: {
            selectClass: false,
            selectClassValue: null,
            submitDialog: false,
            selectedRole: null
        },
        selectedCharacter: null,
        submitHint: ''
    },

    methods: {
        onBackBtnClicked: function () {
            wx.navigateBack().catch(() => {
                wx.redirectTo({
                  url: 'guild?id=' + this.data.activity.guildId,
                })
            });
        },
        saveCharacters: function(characters) {
            console.warn(this.data.activity.realm);
            wx.setStorageSync('myCharacters-' + this.data.activity.realm, characters || []);
        },
        onClassClicked: function() {
            this.setData({
                'ui.selectClass': true
            });
        },
        onClassOptionClicked: function(event) {
            let cls = event.currentTarget.dataset.class;
            this.setData({
                'ui.selectClassValue': cls
            });
        },
        closeSelectDialog: function() {
            this.setData({
                'ui.selectClass': false
            });
        },
        selectClass: function() {
            this.setData({
                'newCharacter.class': this.data.ui.selectClassValue,
                'ui.selectClass': false
            });
        },
        onAddCharacterClicked: function() {
            let character = this.data.newCharacter;
            character.name = this.data.name;
            if (!character.name) {
                wx.showModal({
                    title: "错误",
                    content: "请填写角色名",
                    showCancel: false
                });
                return;
            }

            if (!character.class) {
                wx.showModal({
                    title: "错误",
                    content: "请选择角色职业",
                    showCancel: false
                });
                return;
            }

            let characters = this.data.myCharacters;
            this.handleCharacter(this.data.activity, character);
            characters.push(character);
            this.saveCharacters(characters);
            this.setData({
                myCharacters: characters,
                newCharacter: {
                    name: '',
                    class: 0,
                    realm: this.data.activity.realm
                },
                name: ''
            });
        },
        handleCharacter: function(activity, ch) {
            ch._registered = activity.registrations.filter(x => x.name == ch.name).length > 0;
            if (ch._registered) {
                ch._reg = activity.registrations.filter(x => x.name == ch.name)[0];
            } else {
                if (ch._reg) {
                    delete ch._reg;
                }
            }
            ch._canTank = this.canTank(ch.class);
            ch._canHeal = this.canHeal(ch.class);
            console.warn(ch);
        },
        canTank: function (cls) {
            return 35 & parseInt(cls);
        },
        canHeal: function (cls) {
            return 298 & parseInt(cls);
        },
        onCharacterClicked: function(event) {
            let ch = event.currentTarget.dataset.character;
            this.handleCharacter(this.data.activity, ch);
            this.setData({
                selectedCharacter: ch,
                'ui.submitDialog': true
            });
        },
        closeSubmitDialog: function() {
            this.setData({
                selectedCharacter: null,
                'ui.submitDialog': false
            });
        },
        deleteSelectedCharacter: function() {
            let ch = this.data.myCharacters.filter(x => x.name == this.data.selectedCharacter.name)[0];
            let idx = this.data.myCharacters.indexOf(ch);
            if (idx >= 0) {
                this.data.myCharacters.splice(idx, 1);
                this.setData({
                    myCharacters: this.data.myCharacters
                });
            }

            this.closeSubmitDialog();
        },
        onRoleClicked: function(event) {
            let role = event.currentTarget.dataset.role;
            if (role == 0 && !this.canTank(this.data.selectedCharacter.class)) {
                return;
            }
            if (role == 2 && !this.canHeal(this.data.selectedCharacter.class)) {
                return;
            }
            this.setData({
                'ui.selectedRole': role
            });
        },
        onSubmitClicked: function() {
            if (!this.data.ui.selectedRole) {
                wx.showModal({
                    title: "错误",
                    content: "请选择一个职责",
                    showCancel: false
                });
                return;
            }

            let self = this;
            let body = {
                name: this.data.selectedCharacter.name,
                role: this.data.ui.selectedRole,
                hint: this.hint,
                class: this.data.selectedCharacter.class
            };

            wx.showLoading({
                title: '报名中...',
            })
            qv.post(`${this.data.host}/api/activity/${this.data.activity.id}/registrations`, body).then(data => {
                wx.hideLoading({});
                wx.$activity.loadActivity();
                self.setData({
                    selectedCharacter: null,
                    'ui.selectedRole': false,
                    'ui.submitDialog': false
                });
                wx.redirectTo({
                  url: 'activity?id=' + this.data.activity.id,
                })
                wx.showToast({
                  title: '报名成功',
                })
            });
        },
        onTakeLeaveClicked: function() {
            let ch = this.data.selectedCharacter;
            console.log(ch);
            this.takeLeave(ch, ch._reg.status != 3);
        },
        takeLeave: function (ch, takeLeave) {
            let reg = ch._reg;
            reg.status = takeLeave ? 3 : 0;
            wx.showLoading({
                title: takeLeave ? '请假中...' : '取消请假中...',
            })
            let self = this;
            return qv.put(this.data.host + '/api/activity/' + this.data.activity.id + '/registrations/' + reg.id, { status: reg.status, role: reg.role }).then(() => {
                wx.hideLoading({});
                self.setData({
                    selectedCharacter: null,
                    'ui.selectedRole': false,
                    'ui.submitDialog': false
                });
                wx.redirectTo({
                  url: 'activity?id=' + this.data.activity.id,
                })
                wx.showToast({
                  title: '操作成功',
                })
            });
        },
    },

    lifetimes: {
        attached: function () {
            let activity = this.properties.activity;

            let myCharacters = wx.getStorageSync('myCharacters-' + activity.realm) || [];
            for (let i = 0; i < myCharacters.length; ++i) {
                this.handleCharacter(activity, myCharacters[i]);
            }

            this.setData({
                activity: activity,
                canBack: !!wx.$guild,
                myCharacters: myCharacters,
                'newCharacter.realm': activity.realm
            });
        }
    }
})
