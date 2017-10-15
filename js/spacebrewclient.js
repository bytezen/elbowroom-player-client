  let SB_SERVER = "127.0.0.1" //TODO: pass via queryParam
      ,SB_PORT = 9000
      ,SB_CHANNEL_NAME = "PLAYER 0"   //TODO: pass via queryParam
      ,SB_CHANNEL = "player0"      //TODO: pass via queryParam
      ,SB_CHANNEL_TYPE = "string" //string"
      ,SB_DESCRIPTION = SB_CHANNEL_NAME + " player client"
      ,playerId = null
      ,channelId = "" 
      ,server = ""
      ,clientName = ""
      ,clientDescription = ""
      ,spacebrew = {}
      ,jumpCount = 5
      ,currJumpCount = jumpCount

  const STATE_ACTIVATED = "stateActivated"
        ,STATE_NOT_ACTIVATED = "stateNotActivated"

  var move = null; 

  let initSpacebrew = () => {
    console.log('[initSpacebrew] spacebrew = ' + spacebrew)
    move = sendToServer.bind(null,channelId,SB_CHANNEL_TYPE);
    jump = sendToServer.bind(null,channelId,SB_CHANNEL_TYPE, "jump");
    spacebrew = new Spacebrew()

    //this should always work as a test

    //spacebrew.addPublish(channel,SB_CHANNEL_TYPE,"")
    //spacebrew.connect(server, SB_PORT, clientName, clientDescription);

    spacebrew.addPublish(channelId,SB_CHANNEL_TYPE,"")
    spacebrew.connect(server, SB_PORT, clientName, clientDescription);    
  }
  
  
  //spacebrew.addSubscribe("player0_moves","string","")
  //spacebrew.onStringMessage( onStringMessage )
  // spacebrew.connect(SB_SERVER, SB_PORT, SB_NAME, SB_DESCRIPTION);