
//データ処理
var global_playerlist;
var global_turn;
var title_name;
function change(ev){
   $('li').removeClass('selected');
     
//   document.getElementById('graph').innerText = "";
	
	var files=ev.target.files;
	
	var file=files[0];
	if(!file)return;
	/*
    var titleelement = document.getElementById('filename');
    titleelement.childNodes.item(0).nodeValue = file.name;
    */
    title_name = file.name;
    
    var playerlist = {};
    var turn = [];
    
	var reader=new FileReader();
	reader.onload=function(e){
      var result = reader.result.split('\r\n');
      var maxline = result.length;
      var taglist = [];
      for(var currentnumber = 0; currentnumber < maxline ; currentnumber++){
       var data_strip = result[currentnumber].split(' ');
       
        if(data_strip[0] === 'addplayer'){
        playerlist[data_strip[2]] = {'name' : data_strip[3]};
        }
        
        if(data_strip[0] === 'tag'){
        taglist.push(data_strip[2]);
        }
        
        if(data_strip[0] === 'turn'){
        turn.push(data_strip[1]);
        }
        
        if(data_strip[0] === 'data'){
         var taglist_length = taglist.length;
          for(var current_tag = 0; current_tag < taglist_length; current_tag++){
           if(data_strip[2] == current_tag){
            if(!playerlist[data_strip[3]][taglist[current_tag]]){
            playerlist[data_strip[3]][taglist[current_tag]] = {};
            }
           playerlist[data_strip[3]][taglist[current_tag]][data_strip[1]] = parseInt(data_strip[4]);
           }
          }
        }
        
      }
    var lastturn = turn.length;
    for(var current_player_pos in playerlist){
     for(var current_tag_name in playerlist[current_player_pos]){
      if(current_tag_name === 'name'){
      continue;
      }
     var array = [];
      for(var current_turn = 0; current_turn < lastturn; current_turn++){
       if(!playerlist[current_player_pos][current_tag_name][current_turn]){
       playerlist[current_player_pos][current_tag_name][current_turn] = 0;
       }
      array.push(playerlist[current_player_pos][current_tag_name][current_turn]);
     }
     playerlist[current_player_pos][current_tag_name] = array;
     }
    }
   };
 global_playerlist = playerlist;
 global_turn = turn;
	reader.readAsText(file);
}


//チャートプロセス
var chart1; // globally available

$('li').click(function() {
     $('li').removeClass('selected');
     $(this).addClass('selected');
      if(title_name === undefined){
      return;
      }
     var playerdata = global_playerlist;
     var taglist = ["pop", "bnp", "mfg", "cities", "techs", "munits", "settlers", "wonders", "techout", "landarea", "settledarea", "pollution", "literacy", "spaceship", "gold", "taxrate", "scirate", "luxrate", "riots", "happypop", "contentpop", "unhappypop", "specialists", "gov", "corruption", "score", "unitsbuilt", "unitskilled", "unitslost"];
     var turn = global_turn;

     var dataseries = [];
     var target = taglist[$('li').index(this)];
       for(var item in playerdata){
       var temp = {};
       temp.name = playerdata[item]['name'];
       temp.data = playerdata[item][target];
       dataseries.push(temp);
       }
      chart1 = new Highcharts.Chart({
         chart: {
            height : 20 * $('li').length + 1,
            borderColor:'gray',
            borderWidth:1,
            borderRadius:0,
            renderTo: 'graph',
            type: 'line',
            zoomType:'xy',
            backgroundColor:'#FFFFFF'
         },
         title: {
            text: title_name + ' : ' + $(this).text()
         },
         plotOptions:{
          line:{
           lineWidth: 2,
           marker: {
                    enabled : false
                    }
          }
         },
         xAxis: {
            tickInterval : 20,
            categories: turn
         },
         yAxis:
         {
            title: {
               text: 'Score'
            },
            min:0
         },
         series: dataseries
         }
       );
   });