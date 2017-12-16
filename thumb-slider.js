(function(window){
	// Declearing our object
	window.thumbSlider = {};

	// Basic settings
	thumbSlider.speed = 5;
	thumbSlider.timer = 10; // in milli-second

	// General Functions
	var removePx = function(value){
			return Math.round(Number(value.substr(0, value.indexOf("px"))));
	};
	var getStyle = function(styleName, elm){
		return window.getComputedStyle(elm).getPropertyValue(styleName);
	};
	
	// Gives the base width of the element
	var baseWidth = function(elm){
		return removePx(getStyle("width", elm));
	};
	var baseHeight = function(elm){
		return removePx(getStyle("height", elm));
	};
	
	// BaseWidth + Padding + Border + Margin
	var outerWidthWithMargin = function(elm){
		return removePx(getStyle("width", elm)) + removePx(getStyle("padding-left", elm)) + removePx(getStyle("padding-right", elm)) + removePx(getStyle("border-left-width", elm)) + removePx(getStyle("border-right-width", elm)) + removePx(getStyle("margin-left", elm)) + removePx(getStyle("margin-right", elm));
	};
	var outerHeightWithMargin = function(elm){
		return removePx(getStyle("height", elm)) + removePx(getStyle("padding-top", elm)) + removePx(getStyle("padding-bottom", elm)) + removePx(getStyle("border-top-width", elm)) + removePx(getStyle("border-bottom-width", elm)) + removePx(getStyle("margin-top", elm)) + removePx(getStyle("margin-bottom", elm));
	};

	
	thumbSlider.init = function(slider){
		
		var cssSetup = {
			ulWidth: 0,
			btnWidth: 0,
			containerWidth: 0,
			liHeight: 0,
			innerDivWidth: 0
		}
		
		var domElm = {
			sliderBase: "",
			listItems: "",
			btn: "",
			container: "",
			ul: "",
			innerDiv: ""
		}
		
		var mouseDownTimer = null;

		domElm.sliderBase = document.getElementById(slider);
		domElm.ul = domElm.sliderBase.querySelectorAll("ul")[0];
		domElm.listItems = domElm.sliderBase.querySelectorAll("ul li");
		domElm.lftBtn = domElm.sliderBase.getElementsByClassName("thumb-btn")[0];
		
		domElm.rightBtn = domElm.sliderBase.getElementsByClassName("thumb-btn")[1];
		domElm.container = domElm.sliderBase.getElementsByClassName("thumb-outer-container")[0].parentElement;
		domElm.innerDiv = domElm.sliderBase.getElementsByClassName("thumb-inner-container")[0];
		
		var heights = [];
		for(var i=0; i<domElm.listItems.length; i++){
			heights.push(outerHeightWithMargin(domElm.listItems[i]));
			cssSetup.ulWidth += outerWidthWithMargin(domElm.listItems[i]);
		}
		cssSetup.liHeight = Math.max.apply(Math, heights);
		cssSetup.btnWidth = outerWidthWithMargin(domElm.lftBtn);
		cssSetup.containerWidth = baseWidth(domElm.container);
		cssSetup.innerDivWidth = cssSetup.containerWidth - 2*(cssSetup.btnWidth) -2;
		(function setUpStyle(){
			domElm.lftBtn.setAttribute("style", "height: "+cssSetup.liHeight+"px; "+"line-height: "+cssSetup.liHeight+"px;");
			domElm.rightBtn.setAttribute("style", "height: "+cssSetup.liHeight+"px; "+"line-height: "+ cssSetup.liHeight+"px;");
			domElm.ul.setAttribute("style", "width: "+ cssSetup.ulWidth+"px;");
			domElm.innerDiv.setAttribute("style", "width: "+ cssSetup.innerDivWidth+"px;");
		}());

		
		var maxLeft = (cssSetup.innerDivWidth - cssSetup.ulWidth);

		var move = function(value, direction){
			var nextPosition = removePx(getStyle("left", domElm.ul)) + value*direction;
			if(nextPosition<maxLeft){
				nextPosition = maxLeft;
			}else if(nextPosition>0){
				nextPosition = 0;
			}
			domElm.ul.setAttribute("style", "left: "+ nextPosition +"px;");
		};
		
		var moveX = function(){
			move(window.thumbSlider.speed, 1);
		};
		var moveNegX = function(){
			move(window.thumbSlider.speed, -1);
		};
		
		domElm.lftBtn.addEventListener("click", moveX);
		
		domElm.lftBtn.onmousedown = function(){
			mouseDownTimer = setInterval(moveX, window.thumbSlider.timer);
		};
		
		domElm.rightBtn.addEventListener("click", moveNegX);
		
		domElm.rightBtn.onmousedown = function(){
			mouseDownTimer = setInterval(moveNegX, window.thumbSlider.timer);
		};
		
		window.onmouseup = function(){
			if(mouseDownTimer !== null){
				clearInterval(mouseDownTimer);
				mouseDownTimer = null;
			}
		};
	};

	
}(window));