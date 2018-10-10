class NodeStack {
    constructor(nodeID) {
        this.materialID = null;
        this.textureID = null;
        this.transform = mat4.create();
    }
    setValues(mat,tex,tg){
        this.materialID = mat;
        this.textureID = tex;
        mat4.copy(this.transform,tg);
    }

    apply(graph){
        graph.materials[materialID].apply();
        if(this.textureID == "none"){
            graph.textures[this.textureID].unbind(0);
        }
        else{
            graph.textures[this.textureID].bind(0);
        }
        graph.scene.setMatrix(tg);
    }
}