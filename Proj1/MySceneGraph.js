var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

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
            return "tag <materials> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
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
    }

    /**
     * Parses the <scene> block.
     */
    parseScene(SceneNode) {
        this.idRoot = this.reader.getString(SceneNode, 'root');
        this.axisLength = this.reader.getFloat(SceneNode, 'axis_length');

        this.log("Parsed scene");
    }

    parseViews(viewsNode) {
        var children = viewsNode.children;
        var nodeNames = []
        var grandchildren = [];
        var id;
        var indexFrom, indexTo;
        var fx, fy, fz, tx, ty, tz;
        var near, far, angle, left, right, top, bottom;

        for (var i = 0; i < children.length; i++) {



            if (children[i].nodeName == "perspective") {
                grandchildren = children[i].children;

                for (var j = 0; j < grandchildren.length; j++) {
                    nodeNames.push(children[i].nodeName);
                }

                indexFrom = nodeNames.indexOf("from");
                indexTo = nodeNames.indexOf("to");

                id = this.reader.getString(children[i], 'id');
                near = this.reader.getFloat(children[i], 'near');
                far = this.reader.getFloat(children[i], 'far');
                angle = this.reader.getFloat(children[i], 'angle');

                fx = this.reader.getFloat(grandchildren[indexFrom], 'x');
                fy = this.reader.getFloat(grandchildren[indexFrom], 'y');
                fz = this.reader.getFloat(grandchildren[indexFrom], 'z');

                tx = this.reader.getFloat(grandchildren[indexTo], 'x');
                ty = this.reader.getFloat(grandchildren[indexTo], 'y');
                tz = this.reader.getFloat(grandchildren[indexTo], 'z');

                //guardar perspective
                nodeNames = [];
            }
            else if (children[i].nodeName == "ortho") {
                id = this.reader.getString(children[i], 'id');
                near = this.reader.getFloat(children[i], 'near');
                far = this.reader.getFloat(children[i], 'far');
                left = this.reader.getFloat(children[i], 'left');
                right = this.reader.getFloat(children[i], 'right');
                top = this.reader.getFloat(children[i], 'top');
                bottom = this.reader.getFloat(children[i], 'bottom');

                //guardar ortho
            }
            else {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
        }

        this.log("Parsed views");
    }

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

    parseStuff(SceneNode) {

        var children = SceneNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Frustum planes
        // (default values)
        this.near = 0.1;
        this.far = 500;
        var indexFrustum = nodeNames.indexOf("frustum");
        if (indexFrustum == -1) {
            this.onXMLMinorError("frustum planes missing; assuming 'near = 0.1' and 'far = 500'");
        }
        else {
            this.near = this.reader.getFloat(children[indexFrustum], 'near');
            this.far = this.reader.getFloat(children[indexFrustum], 'far');

            if (!(this.near != null && !isNaN(this.near))) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            }
            else if (!(this.far != null && !isNaN(this.far))) {
                this.far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            }

            if (this.near >= this.far)
                return "'near' must be smaller than 'far'";
        }

        // Checks if at most one translation, three rotations, and one scaling are defined.
        if (SceneNode.getElementsByTagName('translation').length > 1)
            return "no more than one initial translation may be defined";

        if (SceneNode.getElementsByTagName('rotation').length > 3)
            return "no more than three initial rotations may be defined";

        if (SceneNode.getElementsByTagName('scale').length > 1)
            return "no more than one scaling may be defined";

        // Initial transforms.
        this.initialTranslate = [];
        this.initialScaling = [];
        this.initialRotations = [];

        // Gets indices of each element.
        var translationIndex = nodeNames.indexOf("translation");
        var thirdRotationIndex = nodeNames.indexOf("rotation");
        var secondRotationIndex = nodeNames.indexOf("rotation", thirdRotationIndex + 1);
        var firstRotationIndex = nodeNames.lastIndexOf("rotation");
        var scalingIndex = nodeNames.indexOf("scale");

        // Checks if the indices are valid and in the expected order.
        // Translation.
        this.initialTransforms = mat4.create();
        mat4.identity(this.initialTransforms);

        if (translationIndex == -1)
            this.onXMLMinorError("initial translation undefined; assuming T = (0, 0, 0)");
        else {
            var tx = this.reader.getFloat(children[translationIndex], 'x');
            var ty = this.reader.getFloat(children[translationIndex], 'y');
            var tz = this.reader.getFloat(children[translationIndex], 'z');

            if (tx == null || ty == null || tz == null) {
                tx = 0;
                ty = 0;
                tz = 0;
                this.onXMLMinorError("failed to parse coordinates of initial translation; assuming zero");
            }

            //TODO: Save translation data
        }

        //TODO: Parse Rotations

        //TODO: Parse Scaling

        //TODO: Parse Reference length

        this.log("Parsed initials");

        return null;
    }

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
            if(aux != 0 && aux != 1){
                return "enabled must be 0 or 1, but was " + lightId + ")";
            }
            if(aux == 0){
                enableLight = false;
            }
            if(children[i].nodeName == "spot"){
                var angle = this.reader.getFloat(children[i], 'angle');
                var exponent = this.reader.getFloat(children[i], 'exponent');
                if(angle == null){
                    return " no Angle defined";
                }
                if(exponent == null){
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
            if(children[i].nodeName == "spot"){
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
            if(children[i].nodeName == "spot"){
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
            var light =  new CGFlight(this.scene,lightId);
            if(enableLight){
                light.enable();
            }
            else{
                light.disable();
            }
            light.setPosition(positionLight[0],positionLight[1],positionLight[2],positionLight[3]);
            light.setAmbient(ambientIllumination[0],ambientIllumination[1],ambientIllumination[2],ambientIllumination[3]);
            light.setDiffuse(diffuseIllumination[0],diffuseIllumination[1],diffuseIllumination[2],diffuseIllumination[3]);
            light.setSpecular(specularIllumination[0],specularIllumination[1],specularIllumination[2],specularIllumination[3]);

            if(children[0].nodeName == "spot"){
                light.setSpotCutOff(angle);
                light.setSpotExponent(exponent);
                //TODO Set target
            }

            this.lights.push(light);
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
            this.textures[this.reader.getString(children[i], 'id')] = new CGFtexture(this.scene, './scenes/images/' + this.reader.getString(children[i], 'file'));
        }

        console.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // TODO: Parse block
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

            var transId = this.reader.getString(children[i],'id');

            if(transId == null){
                this.onXMLMinorError("Invalid id:" + transId);
                continue;
            }

            if(this.transforms[transId] != null){
                this.onXMLMinorError("Id already in use:" + transId);
                continue;
            }

            this.initialTransforms = mat4.create();
            mat4.identity(this.initialTransforms);
            this.scene.pushMatrix();
            this.scene.setMatrix(this.initialTransforms);

            for (var j = 0; j < grandchildren.length; j++) {

                if (grandchildren[i].nodeName == "translate"){
                    var tx = this.reader.getFloat(grandchildren[i], 'x');
                    var ty = this.reader.getFloat(grandchildren[i], 'y');
                    var tz = this.reader.getFloat(grandchildren[i], 'z');

                    if (tx == null || ty == null || tz == null) {
                        this.onXMLMinorError("failed to parse coordinates of translation; assuming zero");
                        continue;
                    }


                    this.scene.translate(tx, ty, tz);
                }


                else if(grandchildren[i].nodeName == "rotate") {
                    var axis = this.reader.getString(grandchildren[i], 'axis');
                    var ang = this.reader.getFloat(grandchildren[i],'angle');

                    if(angle == null){
                        this.onXMLMinorError("failed to parse angle of rotation; transformation omitted");
                        continue;
                    }

                    if (axis == "x") {
                        this.scene.rotate(angle,1,0,0);
                    }
                    if (axis == "y") {
                        this.scene.rotate(angle,0,1,0);
                    }
                    if (axis == "z") {
                        this.scene.rotate(angle,0,0,1);
                    }
                    else{
                        this.onXMLMinorError("failed to parse axis of rotation; transformation omitted");
                        continue;
                    }
                }

                else if (grandchildren[i].nodeName == "scale"){
                    var sx = this.reader.getFloat(grandchildren[i], 'x');
                    var sy = this.reader.getFloat(grandchildren[i], 'y');
                    var sz = this.reader.getFloat(grandchildren[i], 'z');

                    if (tx == null || ty == null || tz == null) {
                        this.onXMLMinorError("failed to parse coordinates of scalation; assuming zero");
                        continue;
                    }


                    this.scene.scale(sx, sy, sz);
                }
                else{
                    this.onXMLMinorError("Invalid Transformation");
                }
            }
            mat4.copy(this.initialTransforms,this.scene.getMatrix());
            this.scene.popMatrix();this
            this.transforms[transId] = this.initialTransforms;

        }

        this.log("Parsed transformations");
        return null;

    }

    /**
     * Parses the <primitives> block.
     * @param {nodes block element} primitivesNode
     */
    parsePrimitives(nodesNode) {
        // TODO: Parse block
        this.triangles = [];
        this.rectangles = [];
        this.log("Parsed primitives");
        return null;
    }

    /**
 * Parses the <components> block.
 * @param {nodes block element} componentsNode
 */
    parseComponents(nodesNode) {
        // TODO: Parse block
        this.log("Parsed components");
        return null;
    }

    /*
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
    onXMLMinorErro(message) {
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
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}