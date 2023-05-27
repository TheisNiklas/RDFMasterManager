const isDrawerOpenReducer = (state = false, action:any) => {
    switch(action.type){
        case 'IS_OPEN':
            return !state;
        default:
            return state;
    }
}

export default isDrawerOpenReducer;