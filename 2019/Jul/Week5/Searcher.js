class Searcher{

    constructor(){
        this.error = "Did not implement this method";
    }

    add(range, value){
        throw new Error(this.error);
    }

    search(target){
        throw new Error(this.error);
    }

    display(){
        throw new Error(this.error);
    }

    clear(){
        throw new Error(this.error);
    }
}

module.exports = Searcher;