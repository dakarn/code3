<?

  class VKload {


     private $count = 0;
     private $result = '';
     private $name = '';
     private $id = '';
     private $id1 = '';
     private $jsondata = [];
      

    function __construct( $name )
    {

      $this->name = $name;

    }

   
    public function getCount()
    {

     return $this->count;

    }


    public function getMusic()
    {

       $i = 0;
 
       $this->result = '';

       $this->jsondata = '';

       $postfield = 'act=a_load_section&al=1&album_id=1629317882&claim=0&offset=0&owner_id=113537351&search_history=0&search_lyrics=0&search_performer=0&search_q='.$this->name.'&search_sort=0&type=search';

       $c = curl_init('https://vk.com/al_audio.php'); 

       curl_setopt($c,CURLOPT_USERAGENT,"Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.16"); curl_setopt($c,CURLOPT_POST,true);

       curl_setopt($c,CURLOPT_REFERER,"https://vk.com/audios113537351?q=scooter");

       curl_setopt ($c, CURLOPT_SSL_VERIFYPEER, 0); curl_setopt ($c, CURLOPT_SSL_VERIFYHOST, 2);

       curl_setopt($c,CURLOPT_POSTFIELDS, $postfield ); curl_setopt($c,CURLOPT_COOKIE, file_get_contents('file/user-session.dat') );

       curl_setopt($c,CURLOPT_HTTPHEADER,array('X-Requested-With'=>'XMLHttpRequest','Connection'=>'Keep-Alive','Accept-Encoding'=>'gzip, deflate')); 

       curl_setopt($c,CURLOPT_RETURNTRANSFER,1); $this->result = curl_exec($c); curl_close($c); 


       $this->parse();

       return $this->jsondata;

    }

    public function getFile( $id )
    {
         
         $postfield = 'act=reload_audio&al=1&album_id=-1&ids='.$this->jsondata[$id]['id1'].'_'.$this->jsondata[$id]['id'].'';

         $c = curl_init('https://vk.com/al_audio.php'); 

         curl_setopt($c,CURLOPT_USERAGENT,"Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.16"); curl_setopt($c,CURLOPT_POST,true);

         curl_setopt ($c, CURLOPT_SSL_VERIFYPEER, 0); curl_setopt ($c, CURLOPT_SSL_VERIFYHOST, 2);

         curl_setopt($c,CURLOPT_REFERER,"https://vk.com/audios113537351?q=scooter");

         curl_setopt($c,CURLOPT_POSTFIELDS, $postfield ); curl_setopt($c,CURLOPT_COOKIE, file_get_contents('file/user-session.dat') );

         curl_setopt($c,CURLOPT_HTTPHEADER,array('X-Requested-With'=>'XMLHttpRequest')); curl_setopt($c,CURLOPT_RETURNTRANSFER,1); $result=curl_exec($c); curl_close($c);

         $result =  substr( $result , strpos( $result , "[[" ) ); 

         $result = substr( $result , 1 , strpos( $result , "]]" ) );

         preg_match_all( '/"(.*)"/isU' , $result , $res );

         $url = str_replace( '\\' , '', $res[1][2] ); $basename = basename( substr( $url , 0 , strpos( $url , '?' ) ) );

         copy( $url ,  $basename );

    }


    private function parse()
    {

         $i = 0;

         $this->result =  substr( $this->result , strpos( $this->result , "[[" ) ); 

         $this->result = substr( $this->result , 1 , strpos( $this->result , "]]" ) );

         preg_match_all( '/\[(.*)"\]/isU' , $this->result , $res );

         $this->count = count( $res[1] );

         while ( $i < $this->count )
         {

          preg_match_all( '/"(.*)"/isU' , $res[1][$i] , $data );  
          preg_match( '/,([0-9]{1,3}),/i' , $res[1][$i] , $len ); 

          $this->jsondata[$i] = array("num"=>$i,"artist"=>$data[1][4],"track"=>$data[1][3],"length"=>$len[1],"id"=>$data[1][0],"id1"=>$data[1][1]);
 
          ++$i;

         }

       

    }

  }


  $vk = new VKload( 'Scooter fire' );

  $vk->getMusic( );

  $vk->getFile( 4 );

