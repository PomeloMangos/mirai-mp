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
            selectClassValue: null
        }
    },

    methods: {
        onBackBtnClicked: function () {
            wx.navigateBack();
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
            }
        },
        canTank: function (cls) {
            return !!(35 & cls);
        },
        canHeal: function (cls) {
            return !!(298 & cls);
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
