    const LEFT   = 'left'
         ,RIGHT  = 'right'
         ,UP     = 'up'
         ,DOWN   = 'down'

    var colors = {}
        ,defaultStyle = "w3-black"
        ,defaultColor = "w3-dark-gray"
        ,defaultTextStyle = "w3-text-white"
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

      btns = selectAll(".w3-button")
      _.each(btns, 
             b => {
              // let id = b.id();
              elemSetStyle(b,defaultColor)
              /*
              if( id.indexOf('btnUp') > -1 ) { 
                elemSetStyle(b,defaultColor)
              }
              if( id.indexOf('btnDown') > -1 ) { 
                b.mousePressed(onDirectionButtonClick.bind(null,'down'))
              }
              if( id.indexOf('btnLeft') > -1 ) { 
                b.mousePressed(onDirectionButtonClick.bind(null,'left'))
              }
              if( id.indexOf('btnRight') > -1 ) { 
                b.mousePressed(onDirectionButtonClick.bind(null,'right'))
              }
              if( id.indexOf('btnJump') > -1 ) { 
                b.mousePressed(onJumpButtonClick)
              }
              */              
            });
      // elemSetStyle("#")
      /*
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

        select("#playerLabel")
            .removeClass(defaultTextStyle)
            .addClass(textColorStyle)
      } 

      select("#playerLabel").html("Player " + playerId)  

      select("#jumpCount").html(jumpCount) 
      */
    }


    var initButtonHandlers = () => {
      btns = selectAll(".w3-button")
      _.each(btns, 
             b => {
              let id = b.id();

              if( id.indexOf('btnUp') > -1 ) { 
                b.mousePressed(onDirectionButtonClick.bind(null,'up'));
              }
              if( id.indexOf('btnDown') > -1 ) { 
                b.mousePressed(onDirectionButtonClick.bind(null,'down'))
              }
              if( id.indexOf('btnLeft') > -1 ) { 
                b.mousePressed(onDirectionButtonClick.bind(null,'left'))
              }
              if( id.indexOf('btnRight') > -1 ) { 
                b.mousePressed(onDirectionButtonClick.bind(null,'right'))
              }
              if( id.indexOf('btnJump') > -1 ) { 
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


      /* --------------- */
      /* button handlers */
      /* --------------- */
    
    var onDirectionButtonClick = 
          (direction) => {
            console.log('[onDirectionButtonClick]',direction)
          if( direction === LEFT  || direction === UP    ||   
              direction === RIGHT || direction === DOWN ) {
            
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

      /* --------------- */
      /* player controls */
      /* --------------- */

    function keyPressed(value) {

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
      if(key === ' ' || key === 'j' || key === 'J') { 
        onJumpButtonClick() 
      }
    }

      /* --------------- */
      /* state machine   */
      /* --------------- */

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


      /* --------------- */
      /* view commands   */
      /* --------------- */

      function elemSetText(selector,val) {
        if(_.isString(selector)) {
          select(selector).html(val)
        } else if( _.hasIn(selector,"html") ) {
          selector.html(val)
        }
      }

      function elemReplaceStyle(selector,oStyle,nStyle) {
        if(_.isString(selector)) {
          select(selector).removeClass(oStyle).addClass(nStyle)
        } else if( _.hasIn(selector, "removeClass") ) {
          selector.removeClass(oStyle).addClass(nStyle)
        }
      }

      function elemSetStyle(selector,style) {

        if(_.isString(selector)) {
          select(selector).addClass(style)
        } else if( _.hasIn(selector, "addClass") ) {
          selector.addClass(style)
        }
      }



