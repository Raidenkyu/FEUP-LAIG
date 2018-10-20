class GraphNode {
    constructor(nodeID) {
        this.nodeID = nodeID;
        this.children = [];
        this.leafs = [];
        this.materialsID = [];
        this.materialsIndex = 0;
        this.textureID = null;
        this.xTex = null;
        this.yTex = null;
        this.transform = mat4.create();
    }
    addChildNode(nodeID) {
        this.children.push(nodeID);
    }

    addLeaf(leafID) {
        this.leafs.push(leafID);
    }

    nextMaterial(){
        this.materialsIndex++;
        this.materialsIndex = this.materialsIndex % this.materialsID.length;
    }
}