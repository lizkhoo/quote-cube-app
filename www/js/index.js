
var app = {

//location for messageDiv, in percentage:
    loc: {
        x: 10,
        y: 10
    },

    // Application Constructor
    initialize: function() {
        this.bindEvents();
        console.log("starting app");
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('click', this.resetScreen, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.watchAcceleration();
        app.renderCube();
    },

    watchAcceleration: function(){
        function success(acceleration) {
            var xpos = acceleration.x.toFixed(2);
            var ypos = acceleration.y.toFixed(2);
            var zpos = (acceleration.z - 9.80).toFixed(2);

            app.loc.x -= acceleration.x;
            app.loc.y -= acceleration.y;

            console.log('xpos: '+ xpos);
            console.log('ypos: '+ ypos);
            console.log('zpos: '+ zpos);
        }

        function failure(error) {
            console.log('error');
        }
    },


    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    renderCube: function() {
        var canvas = document.getElementById("myCanvas");
            
            var renderer = new Pre3d.Renderer(canvas);
            
            var cube = Pre3d.ShapeUtils.makeCube(1);
            // Avoid anti-aliasing cracks along quad faces.  We convert to triangles so
            // that overdraw with overlap the textures along the edges.
            Pre3d.ShapeUtils.triangulate(cube);
            
            renderer.fill_rgba = new Pre3d.RGBA(1, 0, 0, 1);
            
            var state = {
                cube_rotate_y_rad: 0.4,
                cube_rotate_x_rad: 0,
                cube_x: 0,
                cube_y: 0
            };
            
            function draw(){
                initCanvasArea(canvas);

                renderer.transform.reset();
                renderer.transform.rotateX(state.cube_rotate_x_rad);
                renderer.transform.rotateY(state.cube_rotate_y_rad);
                //renderer.transform.translate(state.cube_x, state.cube_y, 0);
                renderer.bufferShape(cube);
                
                // White background.
                renderer.ctx.setFillColor(1, 1, 1, 1);
                renderer.drawBackground();
                
                renderer.drawBuffer();
                renderer.emptyBuffer();
            };
            
            renderer.camera.focal_length = 2.5;
            DemoUtils.autoCamera(renderer, 0, 0, -8, 0, 0, 0, draw);
            
            function initCanvasArea(cnv) {
                cnv.width = window.innerWidth;
                cnv.height = ((window.innerHeight)*0.8);
            };
            
            draw();


    }

};

$( document ).on( "deviceready", function(){
        StatusBar.overlaysWebView( false );
        StatusBar.backgroundColorByName("gray");
});


            
