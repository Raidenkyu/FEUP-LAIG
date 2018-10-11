class GraphNode {
    constructor(nodeID) {
        this.nodeID = nodeID;
        this.children = [];
        this.leafs = [];
        this.materialID = null;
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
}