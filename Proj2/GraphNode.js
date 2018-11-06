/**
 * GraphNode class, representing a graph node.
 */
class GraphNode {

    /**
     * @constructor
     */
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
        this.animationsID = [];
        this.animationsIndex = 0;
    }

    /**
     * Adds a child node
     * @param {string} nodeID
     */
    addChildNode(nodeID) {
        this.children.push(nodeID);
    }

    /**
     * Adds a leaf
     * @param {string} leafID
     */
    addLeaf(leafID) {
        this.leafs.push(leafID);
    }

    /**
     * Changes the material to the next one
     */
    nextMaterial(){
        this.materialsIndex++;
        this.materialsIndex = this.materialsIndex % this.materialsID.length;
    }

    

}