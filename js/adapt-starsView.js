/*
* adapt-stars
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Daryl Hedley <darylhedley@gmail.com>
*/
define(function(require) {

    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var StarsView = Backbone.View.extend({

        className: 'stars',

        initialize: function(options) {
            this.minimalUi = options.minimalUi;
            this.isExternallyUpdated = options.isExternallyUpdated;
            if (this.isExternallyUpdated && this.minimalUi) {
                this.listenTo(Adapt, 'stars:set', this.render);
            } else {
                this.listenTo(this.collection, 'change:_isCorrect', this.render);
            }
            this.render();
            this.listenTo(Adapt, 'router:menu router:page', this.toggleVisibility);
        },

        render: function(setScore) {
            var score = 0;
            if (this.isExternallyUpdated && this.minimalUi) score = setScore;
            else score = this.collection.where({_isCorrect: true}).length;
            var data = this.collection.toJSON();
            var template = Handlebars.templates['stars'];
            this.$el.html(template({
                minimalUi: this.minimalUi, 
                score: score, 
                stars:data
            }));
            this.toggleVisibility();
        },

        toggleVisibility: function() {
            var model = Adapt.findById(Adapt.location._currentId);
            if (model.get('_quiz')) {
                this.$el.css({display:"block"});
            } else {
                this.$el.css({display:"none"});
            }
        }

    });

    return StarsView;

});