var intervalID;
document.addEventListener('DOMContentLoaded', function(){
    document.querySelector("#next").addEventListener('click', nextState);
    document.querySelector("#play").addEventListener('click', autoplay);
    initialiseGrid(20,20);
})

function autoplay(){
    console.log(this.innerHTML)
    if (this.innerHTML=="Play"){
        this.innerHTML="Pause"
        intervalID = setInterval(nextState, 100);
    }
    else{
        console.log("clearing")
        clearInterval(intervalID);
        this.innerHTML="Play"
    }
}


function initialiseGrid(width, height){
    let table = document.querySelector('.game-table');
    for(let y=0;y<height;y++){
        let tr = document.createElement("tr");
        for(let x=0;x<width;x++){
            let td = document.createElement("td");
            td.addEventListener('click', cellClicked);
            td.dataset.x=x;
            td.dataset.y=y;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

}

function cellClicked(){
    //console.log(this);
    if(this.classList.contains("alive")){
        this.classList.remove("alive");
    }
    else{
        this.classList.add("alive");
    }
}

function nextState(){
    //console.log("next state")
    let table = document.querySelector('.game-table');
    //console.log(table.rows)
    for(let y=0;y<table.rows.length;y++){
        //console.log("y: "+y)
        let tr = table.rows[y];
        //console.log(tr)
        tr.querySelectorAll('td').forEach(function(td){
            //console.log(td)
            let numAliveNeighbours = countAliveNeighbours(td);
            if(td.classList.contains("alive") && (numAliveNeighbours<2 || numAliveNeighbours>3)){
                td.classList.add("dying");
            }
            else if(!td.classList.contains("alive") && numAliveNeighbours==3){
                td.classList.add("born");
            }
        })
    }
    //console.log("calculated")
    for(let y=0;y<table.rows.length;y++){
        let tr = table.rows[y];
        tr.querySelectorAll('td').forEach(function(td){
            if(td.classList.contains("dying")){
                td.classList.remove("dying");
                td.classList.remove("alive");
            }
            else if(td.classList.contains("born")){
                td.classList.remove("born");
                td.classList.add("alive");
            }
        })
    }
    //console.log("complete")

}

function countAliveNeighbours(cell){
    //console.log(document.querySelector('[data-x="1"][data-y="1"]'))
    let centreX = parseInt(cell.dataset.x)
    let centreY = parseInt(cell.dataset.y)
    let neighbourCoords = [
        [[centreX-1,centreY-1],[centreX,centreY-1],[centreX+1,centreY-1]],
        [[centreX-1,centreY],[centreX+1,centreY]],
        [[centreX-1,centreY+1],[centreX,centreY+1],[centreX+1,centreY+1]]
    ]
    let numAliveNeighbours=0;
    for(let y=0;y<neighbourCoords.length;y++){
        let row = neighbourCoords[y]
        for(let x=0;x<neighbourCoords[y].length;x++){
            let neighbour = document.querySelector(`[data-x="${neighbourCoords[y][x][0]}"][data-y="${neighbourCoords[y][x][1]}"]`)
            if(neighbour!=null && neighbour.classList.contains("alive")){
                numAliveNeighbours++;
            }
        }
    }
    return numAliveNeighbours;
}