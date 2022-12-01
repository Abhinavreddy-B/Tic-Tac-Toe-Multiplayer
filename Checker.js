const CheckWin = (State) => {
    if(State[0] != -1 && State[0] == State[1] && State[0] == State[2]) return true;
    if(State[3] != -1 && State[3] == State[4] && State[3] == State[5]) return true;
    if(State[6] != -1 && State[6] == State[7] && State[6] == State[8]) return true;
    if(State[0] != -1 && State[0] == State[3] && State[0] == State[6]) return true;
    if(State[1] != -1 && State[1] == State[4] && State[1] == State[7]) return true;
    if(State[2] != -1 && State[2] == State[5] && State[2] == State[8]) return true;
    if(State[0] != -1 && State[0] == State[4] && State[0] == State[8]) return true;
    if(State[2] != -1 && State[2] == State[4] && State[2] == State[6]) return true;

    var flag=true;
    for(i=0;i<9;i++){
        if(State[i] === -1){
            flag=false
            break
        }
    }
    if(flag){
        return false;
    }
}

module.exports = CheckWin;