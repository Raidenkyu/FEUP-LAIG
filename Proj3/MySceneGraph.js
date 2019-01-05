var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {

    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;
        this.ready = false;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);

    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse LIGHTS block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse transformations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
        this.ready = true;
    }

    /**
     * Parses the <scene> block.
     * @param {scene block element} SceneNode
     */
    parseScene(SceneNode) {
        this.idRoot = this.reader.getString(SceneNode, 'root');
        this.axisLength = this.reader.getFloat(SceneNode, 'axis_length');

        this.log("Parsed scene");
    }

    /**
     * Parses the <views> block.
     * @param {views block element} viewsNode
     */
    parseViews(viewsNode) {
        this.views = new Array();
        var children = viewsNode.children;
        var nodeNames = []
        var grandchildren = [];
        var id;
        var indexFrom, indexTo;
        var fx, fy, fz, tx, ty, tz;
        var near, far, angle, left, right, top, bottom;

        this.defaultView = this.reader.getString(viewsNode, 'default');

        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            id = this.reader.getString(children[i], 'id');

            if (id == null) {
                this.onXMLMinorError("View with null ID");
                continue;
            }

            if (this.views[id] != null) {
                this.onXMLMinorError(" View with ID " + id + " already in use");
                continue;
            }

            near = this.reader.getFloat(children[i], 'near');
            far = this.reader.getFloat(children[i], 'far');

            if (far == null || near == null) {
                this.onXMLMinorError("unable to parse Camera values");
                continue;
            }

            grandchildren = children[i].children;

            if (children[i].nodeName == "perspective") {


                for (var j = 0; j < grandchildren.length; j++) {
                    nodeNames.push(grandchildren[j].nodeName);
                }

                indexFrom = nodeNames.indexOf("from");
                indexTo = nodeNames.indexOf("to");

                if (indexFrom == -1) {
                    this.onXMLMinorError("Tag 'from' missing");
                    continue;
                }


                if (indexTo == -1) {
                    this.onXMLMinorError("Tag 'to' missing");
                    continue;
                }

                angle = this.reader.getFloat(children[i], 'angle');

                fx = this.reader.getFloat(grandchildren[indexFrom], 'x');
                fy = this.reader.getFloat(grandchildren[indexFrom], 'y');
                fz = this.reader.getFloat(grandchildren[indexFrom], 'z');

                tx = this.reader.getFloat(grandchildren[indexTo], 'x');
                ty = this.reader.getFloat(grandchildren[indexTo], 'y');
                tz = this.reader.getFloat(grandchildren[indexTo], 'z');

                if (angle == null || fx == null || fy == null || fz == null || tx == null || ty == null || tz == null) {
                    this.onXMLMinorError("unable to parse Perspective values");
                    continue;
                }

                var v = new CGFcamera(angle * DEGREE_TO_RAD, near, far, [fx, fy, fz], [tx, ty, tz]);

                this.views[id] = v;

            }
            else if (children[i].nodeName == "ortho") {
                left = this.reader.getFloat(children[i], 'left');
                right = this.reader.getFloat(children[i], 'right');
                top = this.reader.getFloat(children[i], 'top');
                bottom = this.reader.getFloat(children[i], 'bottom');



                if (left == null || right == null || top == null || bottom == null || near == null || far == null) {
                    this.onXMLMinorError("unable to parse Ortho values");
                    continue;
                }


                for (var j = 0; j < grandchildren.length; j++) {
                    nodeNames.push(grandchildren[j].nodeName);
                }

                indexFrom = nodeNames.indexOf("from");
                indexTo = nodeNames.indexOf("to");

                if (indexFrom == -1) {
                    this.onXMLMinorError("Tag 'from' missing");
                    continue;
                }


                if (indexTo == -1) {
                    this.onXMLMinorError("Tag 'to' missing");
                    continue;
                }

                fx = this.reader.getFloat(grandchildren[indexFrom], 'x');
                fy = this.reader.getFloat(grandchildren[indexFrom], 'y');
                fz = this.reader.getFloat(grandchildren[indexFrom], 'z');

                tx = this.reader.getFloat(grandchildren[indexTo], 'x');
                ty = this.reader.getFloat(grandchildren[indexTo], 'y');
                tz = this.reader.getFloat(grandchildren[indexTo], 'z');

                if (fx == null || fy == null || fz == null || tx == null || ty == null || tz == null) {
                    this.onXMLMinorError("unable to parse Perspective values");
                    continue;
                }

                var cam = new CGFcameraOrtho(left, right, bottom, top, near, far, [fx, fy, fz], [tx, ty, tz], [0, 1, 0]);
                this.views[id] = cam;
            }
            nodeNames = [];
        }

        this.log("Parsed views");
    }

    /**
     * Parses the <ambient> block.
     * @param {ambient block element} ambientNode
     */
    parseAmbient(ambientNode) {
        var children = ambientNode.children;
        var nodeNames = [];
        for (var i = 0; i < children.length; i++) {
            nodeNames.push(children[i].nodeName);
        }

        var indexAmbient = nodeNames.indexOf("ambient");
        var indexBackground = nodeNames.indexOf("background");


        this.ambientR = this.reader.getFloat(children[indexAmbient], 'r');
        this.ambientG = this.reader.getFloat(children[indexAmbient], 'g');
        this.ambientB = this.reader.getFloat(children[indexAmbient], 'b');
        this.ambientA = this.reader.getFloat(children[indexAmbient], 'a');
        this.backgroundR = this.reader.getFloat(children[indexBackground], 'r');
        this.backgroundG = this.reader.getFloat(children[indexBackground], 'g');
        this.backgroundB = this.reader.getFloat(children[indexBackground], 'b');
        this.backgroundA = this.reader.getFloat(children[indexBackground], 'a');

    }

    /**
     * Parses the <lights> block.
     * @param {light block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = new Array();
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni" && children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            // Light enable/disable
            var enableLight = true;
            var aux = this.reader.getFloat(children[i], 'enabled');
            if (aux != 0 && aux != 1) {
                return "enabled must be 0 or 1, but was " + aux + ")";
            }
            if (aux == 0) {
                enableLight = false;
            }
            if (children[i].nodeName == "spot") {
                var angle = this.reader.getFloat(children[i], 'angle');
                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (angle == null) {
                    return " no Angle defined";
                }
                if (exponent == null) {
                    return " no Angle defined";
                }
            }


            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var positionIndex = nodeNames.indexOf("location");
            if (children[i].nodeName == "spot") {
                var targetIndex = nodeNames.indexOf("target");
            }
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");




            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

            // Retrieve the target 
            if (children[i].nodeName == "spot") {
                var targetLight = [];
                if (targetIndex != -1) {
                    // x
                    var x = this.reader.getFloat(grandChildren[targetIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the target for ID = " + lightId;
                    else
                        targetLight.push(x);

                    // y
                    var y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the target for ID = " + lightId;
                    else
                        targetLight.push(y);

                    // z
                    var z = this.reader.getFloat(grandChildren[targetIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the target for ID = " + lightId;
                    else
                        targetLight.push(z);
                }
                else
                    return "target undefined for ID = " + lightId;
            }

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // Retrieve the diffuse component
            var diffuseIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + lightId;

            // Retrieve the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(a);
            }
            else
                return "specular component undefined for ID = " + lightId;


            // Store Light global information.
            var light = [];
            light.push(enableLight);
            light.push(positionLight);
            light.push(ambientIllumination);
            light.push(diffuseIllumination);
            light.push(specularIllumination);

            if (children[i].nodeName == "spot") {
                var directionPosition = [targetLight[0] - positionLight[0], targetLight[1] - positionLight[1], targetLight[2] - positionLight[2]];
                var length = Math.sqrt(directionPosition[0] * directionPosition[0] + directionPosition[1] * directionPosition[1] + directionPosition[2] * directionPosition[2]);
                directionPosition[0] = directionPosition[0] / length;
                directionPosition[1] = directionPosition[1] / length;
                directionPosition[2] = directionPosition[2] / length;
                light.push(angle, exponent, directionPosition);
            }

            this.lights[lightId] = light;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        this.textures = new Array();

        var children = texturesNode.children;
        for (var i = 0; i < children.length; i++) {
            var texId = this.reader.getString(children[i], 'id');

            if (texId == null) {
                this.onXMLMinorError("Texture with null ID");
            }

            if (this.textures[texId] != null) {
                this.onXMLMinorError("Texture with ID" + texId + "already in use");
            }

            var tex = new CGFtexture(this.scene, this.reader.getString(children[i], 'file'));
            this.textures[texId] = tex;
        }

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        this.materials = new Array();
        var children = materialsNode.children;


        for (var i = 0; i < children.length; i++) {
            var matId = this.reader.getString(children[i], 'id');

            if (matId == null) {
                this.onXMLMinorError("Null ID");
                continue;
            }

            if (this.materials[matId] != null) {
                this.onXMLMinorError("Id already in use:" + matId);
                continue;
            }

            var shininess = this.reader.getFloat(children[i], 'shininess');

            if (shininess == null) {
                this.onXMLMinorError("failed to parse value of shininess");
            }

            var grandchildren = children[i].children;

            var nodeNames = [];

            for (var j = 0; j < grandchildren.length; j++) {
                nodeNames.push(grandchildren[j].nodeName);
            }

            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            var emissionMaterial = [];
            if (emissionIndex != -1) {
                // R
                var r = this.reader.getFloat(grandchildren[emissionIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the material emission for ID = " + lightId;
                else
                    emissionMaterial.push(r);

                // G
                var g = this.reader.getFloat(grandchildren[emissionIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the material emission for ID = " + lightId;
                else
                    emissionMaterial.push(g);

                // B
                var b = this.reader.getFloat(grandchildren[emissionIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the material emission for ID = " + lightId;
                else
                    emissionMaterial.push(b);

                // A
                var a = this.reader.getFloat(grandchildren[emissionIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the material emission for ID = " + lightId;
                else
                    emissionMaterial.push(a);
            }
            else {
                return "emission component undefined for material :" + matId;
            }

            var ambientMaterial = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandchildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the material ambient for ID = " + lightId;
                else
                    ambientMaterial.push(r);

                // G
                var g = this.reader.getFloat(grandchildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the material ambient for ID = " + lightId;
                else
                    ambientMaterial.push(g);

                // B
                var b = this.reader.getFloat(grandchildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the material ambient for ID = " + lightId;
                else
                    ambientMaterial.push(b);

                // A
                var a = this.reader.getFloat(grandchildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the material ambient for ID = " + lightId;
                else
                    ambientMaterial.push(a);
            }
            else {
                return "ambient component undefined for material :" + matId;
            }

            var diffuseMaterial = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandchildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the material diffuse for ID = " + lightId;
                else
                    diffuseMaterial.push(r);

                // G
                var g = this.reader.getFloat(grandchildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the material diffuse for ID = " + lightId;
                else
                    diffuseMaterial.push(g);

                // B
                var b = this.reader.getFloat(grandchildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the material diffuse for ID = " + lightId;
                else
                    diffuseMaterial.push(b);

                // A
                var a = this.reader.getFloat(grandchildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the material ambient for ID = " + lightId;
                else
                    diffuseMaterial.push(a);
            }
            else {
                return "diffuse component undefined for material :" + matId;
            }

            var specularMaterial = [];
            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandchildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the material specular for ID = " + lightId;
                else
                    specularMaterial.push(r);

                // G
                var g = this.reader.getFloat(grandchildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the material specular for ID = " + lightId;
                else
                    specularMaterial.push(g);

                // B
                var b = this.reader.getFloat(grandchildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the material specular for ID = " + lightId;
                else
                    specularMaterial.push(b);

                // A
                var a = this.reader.getFloat(grandchildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the material specular for ID = " + lightId;
                else
                    specularMaterial.push(a);

            }
            else {
                return "specular component undefined for material :" + matId;
            }

            var material = new CGFappearance(this.scene);
            material.setTextureWrap("REPEAT", "REPEAT");
            material.setShininess(shininess);
            material.setEmission(emissionMaterial[0], emissionMaterial[1], emissionMaterial[2], emissionMaterial[3]);
            material.setAmbient(ambientMaterial[0], ambientMaterial[1], ambientMaterial[2], ambientMaterial[3]);
            material.setDiffuse(diffuseMaterial[0], diffuseMaterial[1], diffuseMaterial[2], diffuseMaterial[3]);
            material.setSpecular(specularMaterial[0], specularMaterial[1], specularMaterial[2], specularMaterial[3]);
            this.materials[matId] = material

        }


        this.log("Parsed materials");
        return null;

    }

    /**
     * Parses the <transformations> node.
     * @param {transformations block element} transformationsNode
     */
    parseTransformations(transformationsNode) {
        this.transforms = new Array();

        var children = transformationsNode.children;
        var grandchildren = [];


        for (var i = 0; i < children.length; i++) {
            grandchildren = children[i].children;

            var transId = this.reader.getString(children[i], 'id');

            if (transId == null) {
                this.onXMLMinorError("Null ID");
                continue;
            }

            if (this.transforms[transId] != null) {
                this.onXMLMinorError("Id already in use:" + transId);
                continue;
            }

            var initialTransforms = this.parseTransformation(grandchildren);
            if (initialTransforms != null) {
                this.transforms[transId] = initialTransforms;
            }
        }

        this.log("Parsed transformations");
        return null;

    }

    /**
     * Parses a single <transformations> block.
     * @param {XMLnode} grandchildren 
     */
    parseTransformation(grandchildren) {
        var initialTransforms = mat4.create();
        mat4.identity(initialTransforms);

        for (var j = 0; j < grandchildren.length; j++) {

            if (grandchildren[j].nodeName == "translate") {
                var tx = this.reader.getFloat(grandchildren[j], 'x');
                var ty = this.reader.getFloat(grandchildren[j], 'y');
                var tz = this.reader.getFloat(grandchildren[j], 'z');

                if (tx == null || ty == null || tz == null) {
                    this.onXMLMinorError("failed to parse coordinates of translation; assuming zero");
                    continue;
                }


                mat4.translate(initialTransforms, initialTransforms, [tx, ty, tz]);
            }


            else if (grandchildren[j].nodeName == "rotate") {
                var axis = this.reader.getString(grandchildren[j], 'axis');
                var angle = this.reader.getFloat(grandchildren[j], 'angle');

                if (angle == null) {
                    this.onXMLMinorError("failed to parse angle of rotation; transformation omitted");
                    continue;
                }

                if (axis == "x") {
                    mat4.rotate(initialTransforms, initialTransforms, angle * DEGREE_TO_RAD, [1, 0, 0]);
                }
                else if (axis == "y") {
                    mat4.rotate(initialTransforms, initialTransforms, angle * DEGREE_TO_RAD, [0, 1, 0]);
                }
                else if (axis == "z") {
                    mat4.rotate(initialTransforms, initialTransforms, angle * DEGREE_TO_RAD, [0, 0, 1]);
                }
                else {
                    this.onXMLMinorError("failed to parse axis of rotation; transformation omitted");
                    continue;
                }
            }

            else if (grandchildren[j].nodeName == "scale") {
                var sx = this.reader.getFloat(grandchildren[j], 'x');
                var sy = this.reader.getFloat(grandchildren[j], 'y');
                var sz = this.reader.getFloat(grandchildren[j], 'z');

                if (sx == null || sy == null || sz == null) {
                    this.onXMLMinorError("failed to parse coordinates of scalation; assuming zero");
                    continue;
                }


                mat4.scale(initialTransforms, initialTransforms, [sx, sy, sz]);
            }
            else {
                this.onXMLMinorError("Invalid Transformation");
            }
        }

        return initialTransforms;
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode
     */
    parseAnimations(animationsNode) {
        this.animations = new Array();
        var children = animationsNode.children;
        for (var i = 0; i < children.length; i++) {
            var animId = this.reader.getString(children[i], 'id');
            var time = this.reader.getFloat(children[i], 'span');
            var animation;

            if (animId == null) {
                this.onXMLMinorError("Null ID");
                continue
            }

            if (this.animations[animId] != null) {
                this.onXMLMinorError("Id already in use:" + animId);
                continue
            }

            if (time == null || time < 0) {
                this.onXMLMinorError("Invalid value for span time: " + time);
                continue
            }

            if (children[i].nodeName == "linear") {
                var grandchildren = children[i].children;
                var controlpoints = [];

                for (var j = 0; j < grandchildren.length; j++) {
                    if (grandchildren[j].nodeName == "controlpoint") {
                        var x = this.reader.getFloat(grandchildren[j], 'xx');
                        var y = this.reader.getFloat(grandchildren[j], 'yy');
                        var z = this.reader.getFloat(grandchildren[j], 'zz');

                        if (x == null || y == null || z == null) {
                            this.onXMLMinorError("failed to parse coordinates of controlpoint");
                            continue;
                        }
                        controlpoints.push([x, y, z]);
                    }
                    else {
                        this.onXMLMinorError("Invalid controlpoint tag: <" + grandchildren[j].nodeName + ">");
                    }

                }
                if (controlpoints.length < 2) {
                    this.onXMLMinorError("Number of controlpoints must be higher than 1");
                    continue;
                }
                animation = ['l', animId, time, controlpoints];

            }
            else if (children[i].nodeName == "circular") {
                var centerString = this.reader.getString(children[i], 'center');
                var centerCoords = centerString.split(' ').map(Number);
                var radius = this.reader.getFloat(children[i], "radius");
                var startang = this.reader.getFloat(children[i], "startang");
                var rotang = this.reader.getFloat(children[i], "rotang");
                animation = ['c', animId, time, centerCoords, radius, startang, rotang];
            }
            else {
                this.onXMLMinorError("Invalid Animation tag: <" + children[i].nodeName + ">");
            }
            this.animations[animId] = animation;
        }
    }

    /**
     * Parses the <primitives> block.
     * @param {nodes block element} primitivesNode
     */
    parsePrimitives(primitivesNode) {

        this.primitives = new Array();
        var children = primitivesNode.children;
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue
            }

            var primId = this.reader.getString(children[i], 'id');

            if (primId == null) {
                this.onXMLMinorError("primitive ID null");
                continue
            }

            if (this.primitives[primId] != null) {
                this.onXMLMinorError("primitive ID already in use, conflict in ID:" + primId);
                continue
            }

            if (children[i].children.length != 1) {
                this.onXMLMinorError("More than one primitive defined for ID:" + primId);
                continue
            }

            var primNode = children[i].children[0];

            var primArray = [];
            if (primNode.nodeName == "triangle") {
                primArray.push('t');

                // x1
                var x1 = this.reader.getFloat(primNode, 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 coordinate from the primitive ID " + primId;
                else
                    primArray.push(x1);

                // y1
                var y1 = this.reader.getFloat(primNode, 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 coordinate from the primitive ID " + primId;
                else
                    primArray.push(y1);

                // z1
                var z1 = this.reader.getFloat(primNode, 'z1');
                if (!(z1 != null && !isNaN(z1)))
                    return "unable to parse z1 coordinate from the primitive ID " + primId;
                else
                    primArray.push(z1);

                // x2
                var x2 = this.reader.getFloat(primNode, 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 coordinate from the primitive ID " + primId;
                else
                    primArray.push(x2);

                // y2
                var y2 = this.reader.getFloat(primNode, 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 coordinate from the primitive ID " + primId;
                else
                    primArray.push(y2);

                // z2
                var z2 = this.reader.getFloat(primNode, 'z2');
                if (!(z2 != null && !isNaN(z2)))
                    return "unable to parse z2 coordinate from the primitive ID " + primId;
                else
                    primArray.push(z2);

                // x3
                var x3 = this.reader.getFloat(primNode, 'x3');
                if (!(x3 != null && !isNaN(x3)))
                    return "unable to parse x3 coordinate from the primitive ID " + primId;
                else
                    primArray.push(x3);

                // y3
                var y3 = this.reader.getFloat(primNode, 'y3');
                if (!(y3 != null && !isNaN(y3)))
                    return "unable to parse y3 coordinate from the primitive ID " + primId;
                else
                    primArray.push(y3);

                // z3
                var z3 = this.reader.getFloat(primNode, 'z3');
                if (!(z3 != null && !isNaN(z3)))
                    return "unable to parse z3 coordinate from the primitive ID " + primId;
                else
                    primArray.push(z3);
            }

            if (primNode.nodeName == "rectangle") {
                primArray.push('r');

                // x1
                var x1 = this.reader.getFloat(primNode, 'x1');
                if (!(x1 != null && !isNaN(x1)))
                    return "unable to parse x1 coordinate from the primitive ID " + primId;
                else
                    primArray.push(x1);

                // y1
                var y1 = this.reader.getFloat(primNode, 'y1');
                if (!(y1 != null && !isNaN(y1)))
                    return "unable to parse y1 coordinate from the primitive ID " + primId;
                else
                    primArray.push(y1);

                // x2
                var x2 = this.reader.getFloat(primNode, 'x2');
                if (!(x2 != null && !isNaN(x2)))
                    return "unable to parse x2 coordinate from the primitive ID " + primId;
                else
                    primArray.push(x2);

                // y2
                var y2 = this.reader.getFloat(primNode, 'y2');
                if (!(y2 != null && !isNaN(y2)))
                    return "unable to parse y2 coordinate from the primitive ID " + primId;
                else
                    primArray.push(y2);
            }

            if (primNode.nodeName == "cylinder") {
                primArray.push('c');

                // base
                var base = this.reader.getFloat(primNode, 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base radius from the primitive ID " + primId;
                else
                    primArray.push(base);

                // top
                var top = this.reader.getFloat(primNode, 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top radius from the primitive ID " + primId;
                else
                    primArray.push(top);

                // height
                var height = this.reader.getFloat(primNode, 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse the height from the primitive ID " + primId;
                else
                    primArray.push(height);

                // slices
                var slices = this.reader.getFloat(primNode, 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse the number of slices from the primitive ID " + primId;
                else
                    primArray.push(slices);

                // stacks
                var stacks = this.reader.getFloat(primNode, 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse the number of stacks from the primitive ID " + primId;
                else
                    primArray.push(stacks);
            }

            if (primNode.nodeName == "sphere") {
                primArray.push('s');

                // radius
                var radius = this.reader.getFloat(primNode, 'radius');
                if (!(radius != null && !isNaN(radius)))
                    return "unable to parse base radius from the primitive ID " + primId;
                else
                    primArray.push(radius);

                // slices
                var slices = this.reader.getFloat(primNode, 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse the number of slices from the primitive ID " + primId;
                else
                    primArray.push(slices);

                // stacks
                var stacks = this.reader.getFloat(primNode, 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse the number of stacks from the primitive ID " + primId;
                else
                    primArray.push(stacks);
            }

            if (primNode.nodeName == "torus") {
                primArray.push('o');

                // inner
                var inner = this.reader.getFloat(primNode, 'inner');
                if (!(inner != null && !isNaN(inner)))
                    return "unable to parse inner radius from the primitive ID " + primId;
                else
                    primArray.push(inner);

                // outer
                var outer = this.reader.getFloat(primNode, 'outer');
                if (!(outer != null && !isNaN(outer)))
                    return "unable to parse outer radius from the primitive ID " + primId;
                else
                    primArray.push(outer);


                // slices
                var slices = this.reader.getFloat(primNode, 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse the number of slices from the primitive ID " + primId;
                else
                    primArray.push(slices);

                // loops
                var loops = this.reader.getFloat(primNode, 'loops');
                if (!(loops != null && !isNaN(loops)))
                    return "unable to parse the number of loops from the primitive ID " + primId;
                else
                    primArray.push(loops);
            }

            if (primNode.nodeName == "plane") {
                primArray.push('p');

                // U
                var u_value = this.reader.getFloat(primNode, 'npartsU');
                if (!(u_value != null && !isNaN(u_value)))
                    return "unable to parse npartsU from the primitive ID " + primId;
                else
                    primArray.push(u_value);

                // V
                var v_value = this.reader.getFloat(primNode, 'npartsV');
                if (!(v_value != null && !isNaN(v_value)))
                    return "unable to parse npartsV from the primitive ID " + primId;
                else
                    primArray.push(v_value);
            }

            if (primNode.nodeName == "patch") {
                primArray.push('a');

                // U points
                var u_points = this.reader.getFloat(primNode, 'npointsU');
                if (!(u_points != null && !isNaN(u_points)))
                    return "unable to parse npointsU from the primitive ID " + primId;
                else
                    primArray.push(u_points);

                // V points
                var v_points = this.reader.getFloat(primNode, 'npointsV');
                if (!(v_points != null && !isNaN(v_points)))
                    return "unable to parse npointsV from the primitive ID " + primId;
                else
                    primArray.push(v_points);

                // U parts
                var u_value = this.reader.getFloat(primNode, 'npartsU');
                if (!(u_value != null && !isNaN(u_value)))
                    return "unable to parse npartsU from the primitive ID " + primId;
                else
                    primArray.push(u_value);

                // V parts
                var v_value = this.reader.getFloat(primNode, 'npartsV');
                if (!(v_value != null && !isNaN(v_value)))
                    return "unable to parse npartsV from the primitive ID " + primId;
                else
                    primArray.push(v_value);

                var grandchildren = primNode.children;
                //console.log(grandchildren);
                if (grandchildren.length != (u_points + 1) * (v_points + 1)) {
                    return "Invalid amount of controlpoints in the primitive ID " + primId;
                }
                else {
                    var controlVertexes = new Array(u_points + 1);

                    for (var u = 0; u < (u_points + 1); u++) {
                        controlVertexes[u] = new Array(v_points + 1);
                        for (var v = 0; v < (v_points + 1); v++) {
                            var x = this.reader.getFloat(grandchildren[u * (v_points + 1) + v], 'xx');
                            var y = this.reader.getFloat(grandchildren[u * (v_points + 1) + v], 'yy');
                            var z = this.reader.getFloat(grandchildren[u * (v_points + 1) + v], 'zz');
                            controlVertexes[u][v] = [x, y, z, 1];
                        }
                    }
                    //console.log(controlVertexes);
                    primArray.push(controlVertexes);
                }

            }

            if (primNode.nodeName == "vehicle") {
                primArray.push('v');
            }

            if (primNode.nodeName == "cylinder2") {
                primArray.push('n');

                // base
                var base = this.reader.getFloat(primNode, 'base');
                if (!(base != null && !isNaN(base)))
                    return "unable to parse base radius from the primitive ID " + primId;
                else
                    primArray.push(base);

                // top
                var top = this.reader.getFloat(primNode, 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top radius from the primitive ID " + primId;
                else
                    primArray.push(top);

                // height
                var height = this.reader.getFloat(primNode, 'height');
                if (!(height != null && !isNaN(height)))
                    return "unable to parse the height from the primitive ID " + primId;
                else
                    primArray.push(height);

                // slices
                var slices = this.reader.getFloat(primNode, 'slices');
                if (!(slices != null && !isNaN(slices)))
                    return "unable to parse the number of slices from the primitive ID " + primId;
                else
                    primArray.push(slices);

                // stacks
                var stacks = this.reader.getFloat(primNode, 'stacks');
                if (!(stacks != null && !isNaN(stacks)))
                    return "unable to parse the number of stacks from the primitive ID " + primId;
                else
                    primArray.push(stacks);
            }

            if (primNode.nodeName == "terrain") {
                primArray.push('g');

                // idtexture
                var idText = this.reader.getString(primNode, 'idtexture');
                //console.log(idText);
                if (idText == null)
                    return "unable to parse idtexture from the primitive ID " + primId;
                else
                    primArray.push(idText);

                // idheightmap
                var idHeightMap = this.reader.getString(primNode, 'idheightmap');
                if (idHeightMap == null)
                    return "unable to parse idheightmap from the primitive ID " + primId;
                else
                    primArray.push(idHeightMap);

                // parts
                var parts = this.reader.getFloat(primNode, 'parts');
                if (!(parts != null && !isNaN(parts)))
                    return "unable to parse the parts from the primitive ID " + primId;
                else
                    primArray.push(parts);

                // heightscale
                var heightscale = this.reader.getFloat(primNode, 'heightscale');
                if (heightscale == null)
                    return "unable to parse the heightscale from the primitive ID " + primId;
                else
                    primArray.push(heightscale);
            }

            if (primNode.nodeName == "water") {
                primArray.push('h');

                // idtexture
                var idText = this.reader.getString(primNode, 'idtexture');
                if (idText == null)
                    return "unable to parse idtexture from the primitive ID " + primId;
                else
                    primArray.push(idText);

                // idwavemap
                var idwavemap = this.reader.getString(primNode, 'idwavemap');
                if (idwavemap == null)
                    return "unable to parse idWaveMap from the primitive ID " + primId;
                else
                    primArray.push(idwavemap);

                // parts
                var parts = this.reader.getFloat(primNode, 'parts');
                if (!(parts != null && !isNaN(parts)))
                    return "unable to parse the parts from the primitive ID " + primId;
                else
                    primArray.push(parts);

                // heightscale
                var heightscale = this.reader.getFloat(primNode, 'heightscale');
                if (!(heightscale != null && !isNaN(heightscale)))
                    return "unable to parse the heightscale from the primitive ID " + primId;
                else
                    primArray.push(heightscale);

                // texscale
                var texscale = this.reader.getFloat(primNode, 'texscale');
                if (!(texscale != null && !isNaN(texscale)))
                    return "unable to parse the texscale from the primitive ID " + primId;
                else
                    primArray.push(texscale);
            }

            if (primNode.nodeName == "buttons") {
                primArray.push('b');
            }

            if (primNode.nodeName == "pieces") {
                primArray.push('w');
          }

            if (primNode.nodeName == "obj") {
                primArray.push('j');

                //Model Path
                var modelPath = this.reader.getString(primNode, "path");

                if (!(modelPath != null && !isNaN(modelPath)))
                    return "unable to parse the path of the model from the primitive ID " + primId;
                else
                    primArray.push(modelPath);

                //Wireframe
                var wireframe = this.reader.getFloat(children[i], 'wireframe');

                if(wireframe == 1){
                    primArray.push(true);
                }
                else{
                    primArray.push(false);
                }
            }

            var graphLeaf = new GraphLeaf(this.scene, primArray[0], primArray); //Index 0 is the char that identifies the type of primitive
            if (graphLeaf.primitive == null) {
                this.log("Error: Primitive is null");
            }
            else {
                this.primitives[primId] = graphLeaf.primitive;
            }


        }

        this.log("Parsed primitives");
        return null;
    }

    /**
    * Parses the <components> block.
    * @param {components block element} componentsNode
    */
    parseComponents(componentsNode) {
        var children = componentsNode.children;
        this.components = new Array();
        this.graphNodes = new Array();
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var compId = this.reader.getString(children[i], 'id');


            if (compId == null) {
                this.onXMLMinorError("component ID null");
                continue
            }

            if (this.components[compId] != null) {
                this.onXMLMinorError("component ID already in use, conflict in ID:" + primId);
                continue
            }

            this.components[compId] = children[i];
        }
        this.parseNodes(this.idRoot);
        this.log("Parsed components");
        return null;
    }

    /**
     * Parses the nodes of the graph
     * @param {nodes ID} nodeId
     */
    parseNodes(nodeId) {
        var graphNode = new GraphNode(nodeId);
        this.graphNodes[nodeId];
        if(this.components[nodeId] == null){
            this.onXMLError("No component with ID " + nodeId + " found");
            return;
        }
        var children = this.components[nodeId].children;
        var nodeNames = [];
        for (var i = 0; i < children.length; i++) {
            nodeNames.push(children[i].nodeName);
        }

        var transformationIndex = nodeNames.indexOf("transformation");
        var materialIndex = nodeNames.indexOf("materials");
        var textureIndex = nodeNames.indexOf("texture");
        var grandchildrenIndex = nodeNames.indexOf("children");
        var animationsIndex = nodeNames.indexOf("animations");

        if (transformationIndex != -1) {
            var transformChildren = children[transformationIndex].children;
            if (transformChildren.length != 0) {
                if (transformChildren[0].nodeName == "transformationref") {
                    var transform = transformChildren[0];
                    var transfId = this.reader.getString(transform, 'id');
                    if (this.transforms[transfId] != null) {
                        mat4.copy(graphNode.transform, this.transforms[transfId]);
                    }
                    else {
                        this.onXMLMinorError("No trasformation for ID : " + transfId);
                    }
                }
                else {
                    var t = this.parseTransformation(transformChildren);
                    if (t != null) {
                        mat4.copy(graphNode.transform, t);
                    }
                }
            }


        }

        if (animationsIndex != -1) {
            var animationsChildren = children[animationsIndex].children;
            for (var j = 0; j < animationsChildren.length; j++) {
                if (animationsChildren[j].nodeName != "animationref") {
                    this.onXMLMinorError("Invalid tag for animation: <" + animationsChildren[j].nodeName + ">");
                }
                var animId = this.reader.getString(animationsChildren[j], 'id');
                if (this.animations[animId] != null) {
                    var animationArray = this.animations[animId];
                    if (animationArray[0] == 'l') {
                        var animation = new LinearAnimation(animationArray[1], animationArray[2], animationArray[3]);
                        graphNode.animations.push(animation);
                    }
                    else if (animationArray[0] == 'c') {
                        var animation = new CircularAnimation(animationArray[1], animationArray[2], animationArray[3], animationArray[4], animationArray[5], animationArray[6]);
                        graphNode.animations.push(animation);
                    }
                }
                else {
                    this.onXMLMinorError("No animation for ID : " + animId);
                }
            }
        }

        if (materialIndex != -1) {
            var materialChildren = children[materialIndex].children;
            for (var j = 0; j < materialChildren.length; j++) {
                var material = materialChildren[j];
                var matId = this.reader.getString(material, 'id');

                if (matId == "inherit" || this.materials[matId] != null) {
                    graphNode.materialsID.push(matId);
                }
                else {
                    this.onXMLMinorError("No material for ID : " + matId);
                }
            }

        }

        if (textureIndex != -1) {
            var texture = children[textureIndex];
            var texId = this.reader.getString(texture, 'id');
            var xTex = this.reader.getFloat(texture, 'length_s', false);
            var yTex = this.reader.getFloat(texture, 'length_t', false);
            if (texId == "none" || texId == "inherit" || this.textures[texId] != null) {
                graphNode.textureID = texId;
                graphNode.xTex = xTex;
                graphNode.yTex = yTex;
            }
            else {
                this.onXMLMinorError("No texture for ID : " + texId);
            }

        }

        var grandchildren = children[grandchildrenIndex].children;

        for (var i = 0; i < grandchildren.length; i++) {
            if (grandchildren[i].nodeName == "componentref") {
                var childId = this.reader.getString(grandchildren[i], 'id');
                graphNode.addChildNode(childId);
                this.parseNodes(childId);
            }

            else if (grandchildren[i].nodeName == "primitiveref") {
                var childId = this.reader.getString(grandchildren[i], 'id');
                graphNode.addLeaf(childId);
            }
            else {
                this.onXMLMinorError("unknown tag <" + grandchildren[i].nodeName + ">");
            }
        }
        this.graphNodes[nodeId] = graphNode;

    }


    /**
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {

        if (this.ready) {
            var matId = Object.keys(this.materials)[0];
            this.processNode(this.idRoot, this.materials[matId], null, 1, 1);
        }

    }

    /**
     * Displays a primitive
     * @param {string} id 
     * @param {float} sLength 
     * @param {float} tLength 
     */
    draw_primitive(id, factorS, factorT) {
        var primitive = this.primitives[id];
        primitive.applyTextures(factorS, factorT);
        primitive.display();
    }

    /**
     * Recursive function that processes the scene graph and draws it
     * @param {string} id 
     * @param {CGFappearance} mat 
     * @param {CGFtexture} text 
     * @param {float} sLength 
     * @param {float} tLength 
     */
    processNode(id, mat, text, sLength, tLength) {


        var node = this.graphNodes[id];
        if (node.materialsID[node.materialsIndex] != "inherit") {
            mat = this.materials[node.materialsID[node.materialsIndex]];
        }


        if (node.textureID != "inherit" && node.textureID != "none") {
            text = this.textures[node.textureID];
            mat.setTexture(text);
        }
        else if (node.textureID == "inherit") {
            mat.setTexture(text);
        }
        else {
            text = null;
            mat.setTexture(null);
        }

        if (node.xTex != null && node.yTex != null) {
            sLength = node.xTex;
            tLength = node.yTex;
        }

        mat.apply();
        mat.setTexture(null);

        this.scene.multMatrix(node.transform);
        this.scene.multMatrix(node.animMatrix);



        for (var i = 0; i < node.leafs.length; i++) {
            if (this.primitives[node.leafs[i]] != null)
                this.draw_primitive(node.leafs[i], sLength, tLength);
        }

        for (var i = 0; i < node.children.length; i++) {
            this.scene.pushMatrix();
            this.processNode(node.children[i], mat, text, sLength, tLength);
            this.scene.popMatrix();

        }





    }

    /**
     * Changes every material to the next one in every component
     */
    nextMaterial() {
        for (var key in this.graphNodes) {
            if (this.graphNodes.hasOwnProperty(key)) {
                this.graphNodes[key].nextMaterial();
            }
        }
    }

    changeScene(filename){
        this.loadedOk = null;
        this.ready = false;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }
}