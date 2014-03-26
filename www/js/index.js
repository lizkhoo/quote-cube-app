var app = {
/*
	location for the messageDiv, in percentage:
*/
	loc: {
		x: 10,
		y: 10
	},
/*
	Application constructor
*/
	initialize: function() {
		this.bindEvents();			// bind any UI events to listeners
		console.log("Starting Accelerometer app");
	},
/*
	bind any events that are required on startup to listeners:
*/
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener('click', this.resetScreen, false);
	},

/*
	this runs when the device is ready for user interaction:
*/
    // generate a random number 1-10

    var quoteNum;
    var quotes = new Array(
        "Look for the question, not the solution.",
        "Observe, imagine and create.",
        "Creativity is not the game preserve of artists, but an intrinsic feature of all human activity.",
        "In any creative endeavor you will be discomfited and that is part of learning.",
        "Communicate emotion.",
        "Don’t see the world as a market, but rather a place that people live 
        in — you are designing for people, not machines.",
        "Be willing to risk, make mistakes, and learn from failure."
        );

	onDeviceReady: function() {
		// start watching the accelerometer:
		app.watchAcceleration();
	},

	watchAcceleration: function() {
		function success(acceleration) {
			
            quoteNum = Math.floor((Math.random()*7)+1); 

            // clear the messageDiv and add the accelerometer values:
			app.clear();
			app.display('X: ' + acceleration.x.toFixed(2));
			app.display('Y: ' + acceleration.y.toFixed(2));
			app.display('Z: ' + (acceleration.z - 9.80).toFixed(2));
            app.display('quote ' + return quotes[quoteNum]; );
			
			// set app.loc using the accelerometer values:
			app.loc.x -= acceleration.x;
			app.loc.y -= acceleration.y;
			
			// set the messageDiv style parameters using app.loc:
			messageDiv.style.top = app.loc.y  + '%';
			messageDiv.style.left = app.loc.x + '%';
		}
			
		function failure(error) {
			// if the accelerometer fails, display the error:
			app.display('Accelerometer error');
			app.display(error);
		}
			
		// taceh the accelerometer every 100ms:	
		var watchAccel = navigator.accelerometer.watchAcceleration(success, failure, {
			frequency: 100
		});
	},
	
	// reset the messageDiv to the center of the screen:
	resetScreen: function() {
		app.loc.x = 50;
		app.loc.y = 50;
		messageDiv.style.top = app.loc.y  + '%';
		messageDiv.style.left = app.loc.x + '%';
	},
	/*
		appends @message to the message div:
	*/
	display: function(message) {
		var label = document.createTextNode(message),
			lineBreak = document.createElement("br");
		messageDiv.appendChild(lineBreak);			// add a line break
		messageDiv.appendChild(label);				// add the text
	},
	/*
		clears the message div:
	*/
	clear: function() {
		messageDiv.innerHTML = "";
	}
};

$(function(){

    var el = document.createElement('div'),
        transformProps = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' '),
        transformProp = support(transformProps),
        transitionDuration = 'transitionDuration WebkitTransitionDuration MozTransitionDuration OTransitionDuration msTransitionDuration'.split(' '),
        transitionDurationProp = support(transitionDuration);

    function support(props) {
        for(var i = 0, l = props.length; i < l; i++) {
            if(typeof el.style[props[i]] !== "undefined") {
                return props[i];
            }
        }
    }

    var mouse = {
            start : {}
        },
        touch = document.ontouchmove !== undefined,
        viewport = {
            x: -10,
            y: 20,
            el: $('.cube')[0],
            move: function(coords) {
                if(coords) {
                    if(typeof coords.x === "number") this.x = coords.x;
                    if(typeof coords.y === "number") this.y = coords.y;
                }

                this.el.style[transformProp] = "rotateX("+this.x+"deg) rotateY("+this.y+"deg)";
            },
            reset: function() {
                this.move({x: 0, y: 0});
            }
        };

    viewport.duration = function() {
        var d = touch ? 50 : 500;
        viewport.el.style[transitionDurationProp] = d + "ms";
        return d;
    }();

    $(document).keydown(function(evt) {
        switch(evt.keyCode)
        {
            case 37: // left
                viewport.move({y: viewport.y - 90});
                break;

            case 38: // up
                evt.preventDefault();
                viewport.move({x: viewport.x + 90});
                break;

            case 39: // right
                viewport.move({y: viewport.y + 90});
                break;

            case 40: // down
                evt.preventDefault();
                viewport.move({x: viewport.x - 90});
                break;

            case 27: //esc
                viewport.reset();
                break;

            default:
                break;
        };
    }).bind('mousedown touchstart', function(evt) {
        delete mouse.last;
        if($(evt.target).is('a, iframe')) {
            return true;
        }

        evt.originalEvent.touches ? evt = evt.originalEvent.touches[0] : null;
        mouse.start.x = evt.pageX;
        mouse.start.y = evt.pageY;
        $(document).bind('mousemove touchmove', function(event) {
            // Only perform rotation if one touch or mouse (e.g. still scale with pinch and zoom)
            if(!touch || !(event.originalEvent && event.originalEvent.touches.length > 1)) {
                event.preventDefault();
                // Get touch co-ords
                event.originalEvent.touches ? event = event.originalEvent.touches[0] : null;
                $('.viewport').trigger('move-viewport', {x: event.pageX, y: event.pageY});
            }
        });

        $(document).bind('mouseup touchend', function () {
            $(document).unbind('mousemove touchmove');
        });
    });

    $('.viewport').bind('move-viewport', function(evt, movedMouse) {

        // Reduce movement on touch screens
        var movementScaleFactor = touch ? 4 : 1;

        if (!mouse.last) {
            mouse.last = mouse.start;
        } else {
            if (forward(acceleration.x, mouse.last.x) != forward(mouse.last.x, movedMouse.x)) {
                mouse.start.x = mouse.last.x;
            }
            if (forward(mouse.start.y, mouse.last.y) != forward(mouse.last.y, movedMouse.y)) {
                mouse.start.y = mouse.last.y;
            }
        }

        viewport.move({
            x: viewport.x + parseInt((mouse.start.y - movedMouse.y)/movementScaleFactor),
            y: viewport.y - parseInt((mouse.start.x - movedMouse.x)/movementScaleFactor)
        });

        mouse.last.x = movedMouse.x;
        mouse.last.y = movedMouse.y;

        function forward(v1, v2) {
            return v1 >= v2 ? true : false;
        }
    });

    /* Just for fun */
    if(!touch) {
        $('.cube > div').eq(2).html('<object width="360" height="360"><param name="movie" value="http://www.youtube.com/v/MY5PkidV1cM?fs=1&amp;hl=en_GB&amp;rel=0"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/MY5PkidV1cM?fs=1&amp;hl=en_GB&amp;rel=0" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" width="360" height="360"></embed></object>');
    }

});			// end of app