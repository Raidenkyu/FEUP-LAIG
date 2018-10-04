class GraphNode {
    constructor(nodeID) {
        this.nodeID = nodeID;
        this.children = [];
        this.materialID = null;
        this.textureID = null;
        this.xTex = null;
        this.yTex = null;
        this.transformMatrix = mat4.create();
    }
    addChildNode(nodeID) {
        this.children.push(nodeID);
    }
}