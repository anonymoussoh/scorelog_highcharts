
var global_playerlist;
var global_turn;
var title_name;
function change(ev){
    $('li').removeClass('selected');

	var files=ev.target.files;

	var file=files[0];
	if(!file)return;
    title_name = file.name;


    //Defile playerlist object to store actual data
    var playerlist = {};
    var turn = [];
    
    //Read file
	var reader=new FileReader();
	reader.onload=function(e){
      //Make array by splitting file
      var result = reader.result.split('\n');
      var maxline = result.length;
      var taglist = [];
      //Map each row
      for(var currentnumber = 0; currentnumber < maxline ; currentnumber++){
       //Remove \r by jQuery's trim
       var each_line = $.trim(result[currentnumber]);
       var data_strip = each_line.split(' ');


        //Add player info
        if(data_strip[0] === 'addplayer'){
        playerlist[data_strip[2]] = {'name' : data_strip[3]};
        }

        //Add tag info
        if(data_strip[0] === 'tag'){
        taglist.push(data_strip[2]);
        }

        //Add turn info
        if(data_strip[0] === 'turn'){
        turn.push(data_strip[1]);
        }

        //Add actual data
        if(data_strip[0] === 'data'){

         //The number of column of actual data to store depends on the length of tag list.
         var taglist_length = taglist.length;

          //Current data strip tag meets which tag type?
          for(var current_tag = 0; current_tag < taglist_length; current_tag++){

           //Current data strip tag meets correct tag type !
           if(data_strip[2] == current_tag){

            //Is it already added ?
            //If not, define object
            if(!playerlist[data_strip[3]][taglist[current_tag]]){
            playerlist[data_strip[3]][taglist[current_tag]] = {};
            }

           //Store actual data to playerlist->playernumber[num]->tagname[string]->turnnumber[num]
           //To make sure, parseInt.
           playerlist[data_strip[3]][taglist[current_tag]][data_strip[1]] = parseInt(data_strip[4]);
           }
          }
        }

      }

    //Calculate last turn by length of turn array
    var lastturn = turn.length;
//    console.log(playerlist);
    //Use for-in because "playerlist" is object
    for(var current_player_pos in playerlist){
//     console.log(current_player_pos);
     for(var current_tag_name in playerlist[current_player_pos]){
      if(current_tag_name === 'name'){
      continue;
      }
     //temporary array
     var array = [];
      //Count up until the number of last turn by "for"
      for(var current_turn = 0; current_turn < lastturn; current_turn++){
       //Set ZERO when current turn data is absent. For civil war AI and incomplete log.
       if(!playerlist[current_player_pos][current_tag_name][current_turn]){
       playerlist[current_player_pos][current_tag_name][current_turn] = 0;
       }
      //Set number
      array.push(playerlist[current_player_pos][current_tag_name][current_turn]);
     }
     //Set temporary array to "playerlist"
     playerlist[current_player_pos][current_tag_name] = array;
     }
    }
   };
 global_playerlist = playerlist;
 global_turn = turn;
	reader.readAsText(file);
}

//Above is data process
//Below is chart rendering process
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
            min:0,
            allowDecimals:false
         },
         series: dataseries
         }
       );
   });
