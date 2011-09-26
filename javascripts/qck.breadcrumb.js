$.Controller("BreadcrumbController", {
    init: function() {
		this.loadArray([
			{ url: "#", refname : "Home" },
			{ url: "#", refname : "Home" }
		]);
    },
	loadArray: function(array) { 
		var self = this;
		$(self.element).fadeOut("slow", function() {
			$(self.element).html($.View("/views/breadcrumb.ejs", { data: array }))
							.jBreadCrumb()
							.fadeIn("slow");
		});
	},
	loadHashes: function(hash_array) {
		var array = hash_array.reverse()
		array.push({ url: "#", refname : "Home" });
		array.push({ url: "#", refname : "Home" });
		this.loadArray(array.reverse());
	}
});


/**
 * @author Jason Roy for CompareNetworks Inc.
 * Thanks to mikejbond for suggested udaptes
 *
 * Version 1.1
 * Copyright (c) 2009 CompareNetworks Inc.
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($)
{

    // Private variables
    
    var _options = {};
    var _container = {};
    var _breadCrumbElements = {};
    var _autoIntervalArray = [];
	var _easingEquation;
    
    // Public functions
    
    jQuery.fn.jBreadCrumb = function(options)
    {
        _options = $.extend({}, $.fn.jBreadCrumb.defaults, options);
        
        return this.each(function()
        {
            _container = $(this);
            setupBreadCrumb();
        });
        
    };
    
    // Private functions
    
    function setupBreadCrumb()
    {
		//Check if easing plugin exists. If it doesn't, use "swing"
		if(typeof(jQuery.easing) == 'object')
		{
			_easingEquation = 'easeOutQuad'
		}
		else
		{
			_easingEquation = 'swing'
		}
    
        //The reference object containing all of the breadcrumb elements
        _breadCrumbElements = jQuery(_container).find('li');
        
        //Keep it from overflowing in ie6 & 7
        jQuery(_container).find('ul').wrap('<div style="overflow:hidden; position:relative;  width: ' + jQuery(_container).css("width") + ';"><div>');
        //Set an arbitrary width width to avoid float drop on the animation
        jQuery(_container).find('ul').width(5000);
        
        //If the breadcrumb contains nothing, don't do anything
        if (_breadCrumbElements.length > 0) 
        {
            jQuery(_breadCrumbElements[_breadCrumbElements.length - 1]).addClass('last');
            jQuery(_breadCrumbElements[0]).addClass('first');
            
            //If the breadcrumb object length is long enough, compress.
            
            if (_breadCrumbElements.length > _options.minimumCompressionElements) 
            {
                compressBreadCrumb();
            };
                    };
            };
    
    function compressBreadCrumb()
    {
    
        // Factor to determine if we should compress the element at all
        var finalElement = jQuery(_breadCrumbElements[_breadCrumbElements.length - 1]);
        
        
        // If the final element is really long, compress more elements
        if (jQuery(finalElement).width() > _options.maxFinalElementLength) 
        {
            if (_options.beginingElementsToLeaveOpen > 0) 
            {
                _options.beginingElementsToLeaveOpen--;
                
            }
            if (_options.endElementsToLeaveOpen > 0) 
            {
                _options.endElementsToLeaveOpen--;
            }
        }
        // If the final element is within the short and long range, compress to the default end elements and 1 less beginning elements
        if (jQuery(finalElement).width() < _options.maxFinalElementLength && jQuery(finalElement).width() > _options.minFinalElementLength) 
        {
            if (_options.beginingElementsToLeaveOpen > 0) 
            {
                _options.beginingElementsToLeaveOpen--;
                
            }
        }
        
        var itemsToRemove = _breadCrumbElements.length - 1 - _options.endElementsToLeaveOpen;
        
        // We compress only elements determined by the formula setting below
        
        //TODO : Make this smarter, it's only checking the final elements length.  It could also check the amount of elements.
        jQuery(_breadCrumbElements[_breadCrumbElements.length - 1]).css(
        {
            background: 'none'
        });
        
        $(_breadCrumbElements).each(function(i, listElement)
        {
            if (i > _options.beginingElementsToLeaveOpen && i < itemsToRemove) 
            {
            
                jQuery(listElement).find('a').wrap('<span></span>').width(jQuery(listElement).find('a').width() + 10);
                
                // Add the overlay png.
                jQuery(listElement).append(jQuery('<div class="' + _options.overlayClass + '"></div>').css(
                {
                    display: 'block'
                })).css(
                {
                    background: 'none'
                });
                if (isIE6OrLess()) 
                {
                    fixPNG(jQuery(listElement).find('.' + _options.overlayClass).css(
                    {
                        width: '20px',
                        right: "-1px"
                    }));
                }
                var options = 
                {
                    id: i,
                    width: jQuery(listElement).width(),
                    listElement: jQuery(listElement).find('span'),
                    isAnimating: false,
                    element: jQuery(listElement).find('span')
                
                };
                jQuery(listElement).bind('mouseover', options, expandBreadCrumb).bind('mouseout', options, shrinkBreadCrumb);
                jQuery(listElement).find('a').unbind('mouseover', expandBreadCrumb).unbind('mouseout', shrinkBreadCrumb);
                listElement.autoInterval = setInterval(function()
                {
                    clearInterval(listElement.autoInterval);
                    jQuery(listElement).find('span').animate(
                    {
                        width: _options.previewWidth
                    }, _options.timeInitialCollapse, _options.easing);
                }, (150 * (i - 2)));
                
            }
        });
        
    };
    
    function expandBreadCrumb(e)
    {
        var elementID = e.data.id;
        var originalWidth = e.data.width;
        jQuery(e.data.element).stop();
        jQuery(e.data.element).animate(
        {
            width: originalWidth
        }, 
        {
            duration: _options.timeExpansionAnimation,
            easing: _options.easing,
            queue: false
        });
        return false;
        
    };
    
    function shrinkBreadCrumb(e)
    {
        var elementID = e.data.id;
        jQuery(e.data.element).stop();
        jQuery(e.data.element).animate(
        {
            width: _options.previewWidth
        }, 
        {
            duration: _options.timeCompressionAnimation,
            easing: _options.easing,
            queue: false
        });
        return false;
    };
    
    function isIE6OrLess()
    {
        var isIE6 = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent);
        return isIE6;
    };
    // Fix The Overlay for IE6
    function fixPNG(element)
    {
        var image;
        if (jQuery(element).is('img')) 
        {
            image = jQuery(element).attr('src');
        }
        else 
        {
            image = $(element).css('backgroundImage');
            image.match(/^url\(["']?(.*\.png)["']?\)$/i);
            image = RegExp.$1;
            ;
        }
        $(element).css(
        {
            'backgroundImage': 'none',
            'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src='" + image + "')"
        });
    };
    
    // Public global variables
    
    jQuery.fn.jBreadCrumb.defaults = 
    {
        maxFinalElementLength: 400,
        minFinalElementLength: 100,
        minimumCompressionElements: 1,
        endElementsToLeaveOpen: 100,					// Nifty hack... doesn't shrink elements...
        beginingElementsToLeaveOpen: 100,			// Nifty hack... doesn't shrink elements...
        timeExpansionAnimation: 800,
        timeCompressionAnimation: 500,
        timeInitialCollapse: 600,
        easing: _easingEquation,
        overlayClass: 'chevronOverlay',
        previewWidth: 10
    };
    
})(jQuery);

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */