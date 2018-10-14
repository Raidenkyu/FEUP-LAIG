class NodeStack {
    constructor(nodeID) {
        this.material = null;
        this.texture = null;
    }
    setValues(mat,tex){
        this.material = mat;
        this.texture = tex;
    }

    apply(graph,texID){
        this.material.apply();
        if(texID == "none"){
            this.texture.unbind(0);
        }
        else{
            this.texture.bind(0);
        }
    }
}