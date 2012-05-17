/*
 * Intentionally simple Android-like Toast notification plugin
 * version 0.2
 * by Kelly Copley
 * copleykj@gmail.com
 *
 * Copyright (c) 2010 Kelly Copley
 * Licensed under Creative Commons 
 * Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)
 * http://creativecommons.org/licenses/by-sa/3.0/
 *
 * NOTE: This script requires jQuery to work.  Download jQuery at
 *       www.jquery.com
 * 
 * Options passed as an object:
 * 		message<string> - The message to display - Default: "This is a Toast"
 * 		displayTime<integer> - Duration to display the Toast in milliseconds - Default: 2000
 * 		inTime<integer> - Duration of the fadeIn effect in milliseconds - Default: 300
 * 		outTime<integer> - Duration of the fadeOut effect in milliseconds - Default: 200
 * 		maxWidth<integer> - The maximum width of the toast message box in pixels - Default: 400
 * 		showDirect<boolean> - If set, show the message immediately instead of queueing - Default: false
 * 
 * Basic usage: $.toast({message:"Message Text"});
 */

(function($) {
	toasting = false; 	// Global to check if toast is being displayed
	toastQue = [];		// Array to store messages if a message is already being displayed
	toast_timer = null; // Timer of currently displaying toast
	
	//return new toastmessage object
	$.toast = function (options) {
		return new toastmessage(options);
	};
	
	var toastmessage = function(options){

		var defaults = {
			message:"This is a Toast",
			displayTime:2000,
			inTime:300,
			outTime:200,
			maxWidth:400,
			showDirect: false
		}; 
			
		options = $.extend(defaults, options);


		if( options.showDirect ) {
			// We have a priority toast, stop displaying current if any
			$("div.toast").remove();
			if ( toast_timer != null ) {
				clearTimeout( toast_timer );
				toast_timer = null;
			}
		} else {
			if( window.toasting) {
				// Currently displaying, add to queue
				window.toastQue.unshift(options);
				return;
			}
		}

		window.toasting = true;
		var toast;
		   		
		//create the new element and add it to the document
		toast = $("<div class='toast'>"+options.message+"</div>");
		$("body").append(toast);
				
		//make sure toast isn't too wide and center it
		//TODO: add options for where to display the notification like bottom-right or top-center
		//TODO: See if there is a faster way to do this, Firefox lags a bit on this step
		toast.css({
			"max-width":options.maxWidth+"px",
			"top":(($(window).height() - toast.outerHeight()) / 2) + $(window).scrollTop() + "px",
			"left":(($(window).width() - toast.outerWidth()) / 2) + $(window).scrollLeft() + "px"
		});
				
		//Show the toast message
		toast.fadeIn(options.inTime);
				
		//Hide the toast and remove it from the document after the set amount of time
		toast_timer = setTimeout(function(){
			toast.fadeOut(options.outTime, function(){
				toast.remove(); 
				window.toasting = false;
						
				//check if there are toasts in the que and call self to display next
				if(window.toastQue.length > 0){
					next = window.toastQue.pop();
					$.toast(next);
				}
			});
		}, options.displayTime);
	};
})(jQuery);
