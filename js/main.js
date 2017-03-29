var grid_size = 4;
grid_map = 'tile';

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

var start_time = 0;
var grid_color = [];
var flipped_card = [];
var flipped_tile_count = 0;
var interval_id = null;
var score = 0;
var high_score = 0;
function initialize_grid(){
    reset_timer();
    reset_score();
    if(interval_id != null){
        clearInterval(interval_id);    
    }
    interval_id = setInterval(update_timer,1000);
    var count  = 0;
    var tmpStr = '';
    var grid_array = [];
    grid_color = [];
    var random_color_array = ['#5c33e9','#75bb95','#ffa700','#d6d8a0','#033658','#a4d419','#070ce7','#f050fe'];
    for(var i = 0; i < grid_size*grid_size; i++){
        grid_array.push(i);
    }
    while(grid_array.length != 0){
        grid_array = shuffle(grid_array);
        grid_color[grid_array[0]] = random_color_array[0];
        grid_color[grid_array[1]] = random_color_array[0];
        random_color_array.splice(0,1);
        grid_array.splice(0,2);
    }
    for(var i = 1; i <= grid_size; i++){
        tmpStr += "<div class = 'row'>"
        for(var j = 1; j <= grid_size; j++){
            tmpStr += "<div id = "+ count +" class = "+ grid_map +"></div>"
            count++;            
        }
        tmpStr += "</div>"
    }
    $('#tile-container')[0].innerHTML = tmpStr;

    $('.tile').click(
        function(){
            if($(this).css('background-color') != "rgb(68, 68, 68)" && $(this).css('background-color') != "#444444" ){
                if(flipped_card.length  == 0){
                    flipped_card.push(this.id);
                    $(this).css('background', grid_color[this.id]);                
                }
                else if(flipped_card.length  == 1 && this.id != flipped_card[0]){
                    flipped_card.push(this.id);
                    $(this).css('background', grid_color[this.id]);                                                
                }
                $(this).toggleClass('rotated');
                setTimeout(flip_card, 400, this);
            }            
        }
    )
}

function flip_card(el){
    if(flipped_card.length  == 2 && el.id != flipped_card[0]){
        if($(el).css('background') == $('#'+flipped_card[0]).css('background')){
            $(el).css('background', '#444');
            $('#'+flipped_card[0]).css('background', '#444');
            flipped_tile_count = flipped_tile_count+2;
            if(flipped_tile_count == 2) {
                score = 20;
            } else {
                score = score + 20;                
            }
        }
        else{
            deselect_tile(el.id,flipped_card[0])
            if(flipped_tile_count < 2){
                score = 0;
            } else {
                score = score - 5;                
            }
        }
        $('#score_value')[0].innerHTML = score;        
        if(score > high_score){
            high_score = score;
            $('#high_score_value')[0].innerHTML = score;                        
        }
        flipped_card = [];
        if(flipped_tile_count == grid_size*grid_size){
            clearInterval(interval_id);
            alert("Game Completed. Your score for this game is " + score);
        }                                                
    }
}

function deselect_tile(el1, el2){
    $('#'+el1).css('background', 'lightblue');
    $('#'+el2).css('background', 'lightblue');
}

function reset_timer(){
    start_time = Date.now();  
    $('#time_value')[0].innerHTML = '0:0';              
}

function update_timer(){
    var current_time = Date.now();
    var time_diff = (current_time - start_time)/1000;
    var minutes = parseInt(time_diff/60);
    var seconds = parseInt(time_diff%60);
    $('#time_value')[0].innerHTML = minutes+':'+seconds;        
}

function reset_score(){
    $('#score_value')[0].innerHTML = 0;    
    flipped_tile_count = 0;
    flipped_card = [];
    score = 0;
}
