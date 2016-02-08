(function(){
  //Detect user language
  var ua = window.navigator.userAgent.toLowerCase();
  var lang;
    // For Google Chrome
    if( ua.indexOf( 'chrome' ) != -1 ){
      lang = ( navigator.languages[0] || navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2);
    }
    // Otherone
    else{
      lang = ( navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2);
    }
   
   //  When language is Japanese
    if(lang == "ja"){
     // Read language json file
     $.get("./ja_lang.json",function(data){
     // Replace file selector description
     $('#file_selector_description').text(data.pop());
     //console.log(data);
     // Replace each item of score tag list
      $('li').map(function(index){
       return $(this).text(data[index]);
      });
     });
    }
})();