const CheckDraw = (State) => {
    var flag=true;
    for(i=0;i<9;i++){
        if(State[i] === -1){
            flag=false
            break
        }
    }
    if(flag){
        return true;
    }else{
        return false
    }
}

module.exports = CheckDraw;