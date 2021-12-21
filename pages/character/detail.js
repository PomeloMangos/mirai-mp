const app = getApp();

Component({
    properties: {
        name: {
            type: String,
            value: null
        },
        realm: {
            type: String,
            value: null
        }
    },

    data: {
        isFullScreen: app.globalData.isFullScreen,
        character: null,
        notFound: false
    },

    methods: {
        loadCharacter: function(realm, name) {
            let qv = require("../../utils/qv");
            let self = this;
            return qv.get(`/api/charactor/${realm}/${name}`).then(result => {
                let character = result.data.data;
                if (character == null) {
                    self.setData({ notFound: true });
                } else {
                    self.setData({ character: character });
                }
            });
        },
        onBackBtnClicked: function() {
            wx.$root.switchTab2(0, 'ch');
        }
    },

    lifetimes: {
        attached: function() {
            this.loadCharacter(this.properties.name, this.properties.realm);
        }
    }
})
