class Searcher{

    constructor(){
        this.map = [];
    }

    add(range, value){
        this.map.push({
            range,
            value
        })
    }

    search(target){
        for(let i = 0; i < this.map.length; i++){
            const [min, max] = this.map[i].range;
            if(min <= target && target <= max){
                return this.map[i];
            }
        }
        return {};
    }

    display(){
        console.log(this.map);
    }

    clear(){
        this.map = null;
    }
}

module.exports = Searcher;