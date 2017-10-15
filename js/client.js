    const LEFT   = 'left'
         ,RIGHT  = 'right'
         ,UP     = 'up'
         ,DOWN   = 'down'

    var colors = {}
        ,defaultStyle = "w3-green"
        ,defaultTextStyle = "w3-text-green"
        ,textColorStyle = null
        ,bgColorStyle = null
        ,params = {}

  
    function preload() {
      colors = loadJSON('data/colors.json')
      params = getURLParams();
      // console.log(getURLParams());

      if(_.isNil(params)) {
        console.error("No parameters passed in\nverify that the url has the format: '?server=<ipaddr>&pid=<0-19>'")
        return;
      }

      server = params.server;
      channelId = "player"+params.pid 
      clientName = "PLAYER " + params.pid 
      playerId = params.pid
      clientDescription = "PLAYER"+params.pid + " client "

      console.log("config = ", server, channelId, clientName,clientDescription, playerId)

    }

    function setup() {
      console.log('[setup]')
      initButtonHandlers();
      initPlayerLook();
      initSpacebrew();

      noCanvas();
      noLoop();


      
    }


    var initPlayerLook = () => {
      //var playeridnum = 2,
      _color = colors[playerId].name

      //once these are loaded then we can
      //assign a style based on the player number
      //get the color and then get css class strings
      textColorStyle = ["bz","text",_color].join("-")
      bgColorStyle = ["bz",_color].join("-")    

      if(!_.isNil(textColorStyle) && !_.isNil(bgColorStyle)) {
        _.each(selectAll(".btnContainer")
              ,it => {
                it.removeClass(defaultStyle)
                it.addClass(bgColorStyle)
              })

        select("#playerId")
            .removeClass(defaultTextStyle)
            .addClass(textColorStyle)
      } 

      select("#playerId").html("Player " + playerId)  

      select("#jumpCount").html(jumpCount) 
    }


    var initButtonHandlers = () => {
      btns = selectAll(".btnContainer")
      _.each(btns, 
             b => {
              let id = b.id();
              if( id == 'btnUp') { 
                b.mousePressed(onDirectionButtonClick.bind(null,'up'));
              }
              if( id == 'btnDown') { 
                b.mousePressed(onDirectionButtonClick.bind(null,'down'))
              }
              if( id == 'btnLeft') { 
                b.mousePressed(onDirectionButtonClick.bind(null,'left'))
              }
              if( id == 'btnRight') { 
                b.mousePressed(onDirectionButtonClick.bind(null,'right'))
              }
              if( id == 'btnJump') { 
                b.mousePressed(onJumpButtonClick)
              }              
            });

      select("#btnActivate")
        .mousePressed(onActivateButtonClick)      
        // .mousePressed(()=>{
        //   sendToServer(channelId,SB_CHANNEL_TYPE,"hello")
        // })
      
    }

    var sendToServer = (id,type,value) =>
      {
        console.log('[sendToServer]',id,type,value);
        spacebrew.send(id,type,value);
      }
//nothing
    var move = null; //sendToServer.bind(null,channelId,SB_CHANNEL_TYPE);

    var onDirectionButtonClick = 
          (direction) => {
            console.log('[onDirectionButtonClick]',direction)
          if( direction === LEFT  || 
              direction === UP    ||   
              direction === RIGHT || 
              direction === DOWN ) {
            move(direction);
          }                                  
        }
        , onActivateButtonClick =
          () => {
            console.log('[onActivateButtonClick] should send activate message to the server and turn on the buttons')
            changeState(STATE_ACTIVATED)
          }
        , onJumpButtonClick =
          () => {
            console.log('[onJumpButtonClick] ')
            //decrease the jump count
            
            if(currJumpCount > 0) {
              //send jump to the server
              jump();
              currJumpCount--; 
              select("#jumpCount").html(currJumpCount) 
            } 

            if(currJumpCount == 0) {
              select("#btnJump").addClass("w3-disabled")
            }
            //if jumps are 0 then disable the button            
          }

    function keyPressed(value) {
      // console.log(keyCode);

      if(keyCode === 37) { move(LEFT) }
      if(keyCode === 38) { move(UP) }
      if(keyCode === 39) { move(RIGHT) }
      if(keyCode === 40) { move(DOWN) }
    }

    function keyTyped() {
      if(key === 'w' || key === 'W') { move(UP) }
      if(key === 'a' || key === 'A') { move(LEFT) }
      if(key === 's' || key === 'S') { move(DOWN) }        
      if(key === 'd' || key === 'D') { move(RIGHT) }
    }

    function changeState(state) {
      if(state === STATE_ACTIVATED) {
        //disable the i want to play button
        //activate the ui
        select('#btnActivate').addClass("w3-hide")
        _.each(selectAll('.btnContainer'), 
             b => { 
              b.removeClass('w3-hide')
            });               
        
        sendToServer(channelId,SB_CHANNEL_TYPE,"hello")
        // if(!spacebrew.connected()) { 
        //    spacebrew.connect(server, SB_PORT, clientName, clientDescription);
        // }                     
      }
      else if(state === STATE_NOT_ACTIVATED) {
        //disable the ui
        //activate the i wanna play button
        select('#btnActivate').removeClass("w3-hide")
        _.each(selectAll('.btnContainer'), 
             b => { 
              b.addClass('w3-hide')
            });

        sendToServer(channelId,SB_CHANNEL_TYPE,"goodbye")
        // if(spacebrew.connected()) { 
        //   spacebrew.close() 
        // }                        
      }
    }

