var Music = (function( )
{

  var offset = 0;



  function setList( data )
  {


     var json = JSON.parse(data); 

     var doc = document.getElementById('content-answer'); 

     doc.innerHTML = '<br>';


     if( json.success == 0 ){ doc.innerHTML = '<br><br><big>'+json.message+'</big>'; return; }
     if( json.list == "" ){ doc.innerHTML = '<br><br><big>��! ���-�� ����� �� ���!</big>'; return; }


     doc.innerHTML = '<br><br><big>����� ������� '+json.count+' MP3 <b>|</b> �������� '+(offset+50)+'</big><br><br>';

     var lists = json.list;

     

     if( offset > 0 ){ doc.innerHTML += '<br><div style="text-align: center; width: 200px; padding: 6px; background: lightgreen; border: thin solid gray; cursor: pointer;"\
     onClick="Music.setOffset( -50 ); Music.requetsList();"><b>�������� ����������</b></div><br>'; }


     for( var k in lists )
     {


        var title = lists[k].title;
        var name = lists[k].artist;


        if( name == null && title == null ) continue;

        if( name == null ){ name = "����������"; }
        if( title == null ){ title = "����������"; }

        if( name.length > 24 ){ name = name.substring( 0 , 24 ); }
        if( title.length > 24 ){ title = title.substring( 0 , 24 ); }

        if( name+title.length > 48 ){ name = name.substring( 0 , 20 ); title = title.substring( 0 , 20 ); }
        
        name = name.replace( /(www|http)(.*)\.(.*){2,5}/ig , '' );    
        title = title.replace( /(www|http)(.*)\.(.*){2,5}/ig , '' );    

        doc.innerHTML += '<div id='+k+'\
        class=item-music data-id='+lists[k].id+' data-duration="'+lists[k].length+'" data-id1='+lists[k].id1+'>\
        '+name+'  -  '+title+'\
        <div class=img_fun><img onClick="Music.loadingFile('+k+', Music.refreshLoad)" title="�������" src=pub/img/loadfile.png height=17>\
        <img title="�������������" src=pub/img/musicplay.png height=17></div>\
        </div>';
        

     }


     if( json.count > 100 + offset && json.list != "" )
     {

      doc.innerHTML += '<br><div style="text-align: center; width: 170px; padding: 8px; background: lightgreen; border: thin solid gray; cursor: pointer;"\
      onClick="Music.setOffset( 50 ); Music.requetsList();"><b>�������� ���</b></div>';

     }
    
  }


  function SendAjax( js )
  {

    var req = new XMLHttpRequest();
    req.onreadystatechange = function()
    { 
       if ( req.readyState == 4 ){ js.even(req.responseText); }
    }

    req.open( 'POST' , js.path, js.async );
    req.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );
    req.send( js.param );

  }



  return {


   refreshLoad: function( data )
   {

     var json = JSON.parse( data ); 
          
     if( json.success ){ open( json.url); }

   },


   submitOK: function()
   {

     if( Music.setOffset > 1 ){ Music.setOffset( -50 ); } else if( Music.setOffset == 0 ){ Music.setOffset( 0 ); }
      Music.requetsList();

   },

   getOffset: function()
   {

     return offset;

   },

   setOffset: function( offsets )
   {

      offset += offsets;

   },


   requetsList: function()
   {
     
     var title = document.getElementsByName( 'music_name' )[0].value;

     if( title == "" ){ document.getElementById('content-answer').innerHTML = '<br><br><big>�� �� ��������� ���� � ���������!</big>'; return; }

     document.getElementById('content-answer').innerHTML = '<br><br><img src="pub/img/loader.gif"><br>\
     ���� ��������...';

     SendAjax({ 
     async: true,
     path: "pub/ajax.php",
     param: "action=requestList&title="+title+"&offset="+Music.getOffset()+"",
     even: function(data)
     {

            setList( data );

     }});

   },


   
   loadingFile: function( id , callbacks )
   {

      var id1 = document.getElementById( id ).getAttribute( 'data-id' );
      var id2 = document.getElementById( id ).getAttribute( 'data-id1' );


      SendAjax({ 
      async: true,
      path: "pub/ajax.php",
      param: "action=loadingFile&id="+id1+"&id1="+id2,
      even: function(data)
      {

        callbacks( data );
           
      }});

   }


  };


})();