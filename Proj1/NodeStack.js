class NodeStack {
    constructor(nodeID) {
        this.material = null;
        this.texture = null;
        this.transform = mat4.create();
    }
    setValues(mat,tex,tg){
        this.material = mat;
        this.texture = tex;
        mat4.copy(this.transform,tg);
    }

    apply(graph,texID){
        this.material.apply();
        if(texID == "none"){
            this.texture.unbind(0);
        }
        else{
            this.texture.bind(0);
        }
        graph.scene.setMatrix(this.transform);
    }
}