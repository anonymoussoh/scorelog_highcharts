
var title_name;
var chart1; // globally available

function change(ev){
    $('li').removeClass('selected');

    var files=ev.target.files;

    var file=files[0];
    if(!file)return;
    title_name = file.name;

    //Defile playerlist object to store actual data
    var playerdata = {};
    var turn = [];

    //Read file
    var reader=new FileReader();
    reader.onload=function(e){
      //Make array by splitting file
    var result = reader.result.split('\n');
    var maxline = result.length;
    var taglist = [];
        //Map each row
        var lineprocessor = function(value,index){
        //Remove \r by trim
        var data_strip = value.trim().split(' ');

        //Add player info
        if(data_strip[0] === 'addplayer'){
            var name = data_strip[3];
            if(data_strip.length > 4){
                name = data_strip.slice(3).join(' ');
            }
            playerdata[data_strip[2]] = {'name' : name};
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
            if(!playerdata[data_strip[3]][current_tag]){
                playerdata[data_strip[3]][current_tag] = [];
                playerdata[data_strip[3]][current_tag] = turn.map(function(){return 0;});
                playerdata[data_strip[3]][current_tag].pop();
            }
            playerdata[data_strip[3]][current_tag].push(parseInt(data_strip[4],10));
        }
        };
    result.forEach(lineprocessor);
    };
    reader.readAsText(file);

    $('li').click(function() {
        $('li').removeClass('selected');
        $(this).addClass('selected');
        if(title_name === undefined){
            return;
        }
        var taglist = ["pop", "bnp", "mfg", "cities", "techs", "munits", "settlers", "wonders", "techout", "landarea", "settledarea", "pollution", "literacy", "spaceship", "gold", "taxrate", "scirate", "luxrate", "riots", "happypop", "contentpop", "unhappypop", "specialists", "gov", "corruption", "score", "unitsbuilt", "unitskilled", "unitslost"];

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

}
