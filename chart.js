
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
       //Remove \r by trim
       var data_strip = result[currentnumber].trim().split(' ');

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
            var current_tag = taglist[data_strip[2]];
            //Is it already added ?
            //If not, define object
            if(!playerlist[data_strip[3]][current_tag]){
                playerlist[data_strip[3]][current_tag] = [];
                playerlist[data_strip[3]][current_tag] = turn.map(function(){return 0;});
                playerlist[data_strip[3]][current_tag].pop();
            }
            playerlist[data_strip[3]][current_tag].push(parseInt(data_strip[4],10));
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
       temp.name = playerdata[item].name;
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
               text: 'Point'
            },
            min:0,
            allowDecimals:false
         },
         series: dataseries
         }
       );
   });
