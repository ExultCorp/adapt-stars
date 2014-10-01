/*
* adapt-stars
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Daryl Hedley <darylhedley@gmail.com>
*/
define(function(require) {

    var Adapt = require('coreJS/adapt');
    var StarsView = require('extensions/adapt-stars/js/adapt-starsView');

    var questionComponents;
    var minimalUi = false;
    var isExternallyUpdated = false;

    Adapt.on('app:dataReady', function() {

        var Stars = Adapt.course.get('_stars');

        if (Stars && Stars._isEnabled) {

            // If stars is enabled - filter question components into a collection
            questionComponents = new Backbone.Collection(Adapt.components.where({_isQuestionType: true}));
            if (Stars._minimalUi) {
                minimalUi = true;
            }
            if (Stars._isExternallyUpdated) {
                isExternallyUpdated = true;
            }

            // Only setup navigation event listener if stars is enabled
            setupNavigationEvent();

        }        
        
        if (isExternallyUpdated) {
	        var diffuseAssessment = Adapt.course.get('_diffuseAssessment');
	        if (diffuseAssessment && diffuseAssessment._isEnabled === true) {
	            Adapt.on("diffuseAssessment:assessmentCalculate diffuseAssessment:assessmentComplete", function(assessment) {
	                Adapt.trigger("stars:set",assessment._currentPoints);
	            });
	        }
	    }

    });

    function setupNavigationEvent() {

        Adapt.on('navigationView:postRender', function(navigationView) {
            navigationView.$('.navigation-inner').append(new StarsView({
                minimalUi: minimalUi,
                isExternallyUpdated: isExternallyUpdated,
                collection: questionComponents
            }).$el);
        });

    }

});