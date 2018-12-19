/**
 * ButtonCollection
 * @constructor
 */

class ButtonCollection extends CGFobject{
    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.buttons = [];
        this.createButtons();
        this.testShader = new CGFshader(scene.gl, "shaders/button.vert", "shaders/button.frag");
		this.testShader.setUniformsValues({uSampler: 0});
    };

    display(){
        this.scene.setActiveShader(this.testShader);
        let i = 0;
        let n;
        
        //Buttons top
        for(n = 0; n < 19; n++){
            this.scene.pushMatrix();
            this.scene.translate(1.5, 0, 0.5);
            this.scene.translate(n, 0, 0);
            this.scene.registerForPick(i+1, this.buttons[i]);

            this.buttons[i].display();
            this.scene.popMatrix();
            i++;
        }
        //Buttons bot
        for(n = 0; n < 19; n++){
            this.scene.pushMatrix();
            this.scene.translate(1.5, 0, 20.5);
            this.scene.translate(n, 0, 0);
            this.scene.registerForPick(i+1, this.buttons[i]);
            
            this.buttons[i].display();
            this.scene.popMatrix();
            i++;
        }
        //Buttons left
        for(n = 0; n < 19; n++){
            this.scene.pushMatrix();
            this.scene.translate(0.5, 0, 1.5);
            this.scene.translate(0, 0, n);
            this.scene.registerForPick(i+1, this.buttons[i]);
            
            this.buttons[i].display();
            this.scene.popMatrix();
            i++;
        }
        
        //Buttons right
        for(n = 0; n < 19; n++){
            this.scene.pushMatrix();
            this.scene.translate(20.5, 0, 1.5);
            this.scene.translate(0, 0, n);
            this.scene.registerForPick(i+1, this.buttons[i]);
            
            this.buttons[i].display();
            this.scene.popMatrix();
            i++;
        }
        
        this.scene.setActiveShader(this.scene.defaultShader);

    };    

    createButtons(){

        //Buttons up
        let aux;
        aux = new MyButton(this.scene, "letA");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letB");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letC");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letD");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letE");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letF");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letG");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letH");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letI");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letJ");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letK");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letL");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letM");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letN");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letO");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letP");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letQ");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letR");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letS");
        this.buttons.push(aux);

        //Buttons down
        aux = new MyButton(this.scene, "letA");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letB");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letC");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letD");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letE");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letF");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letG");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letH");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letI");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letJ");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letK");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letL");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letM");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letN");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letO");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letP");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letQ");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letR");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "letS");
        this.buttons.push(aux);

        //Buttons left
        aux = new MyButton(this.scene, "num19");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num18");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num17");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num16");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num15");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num14");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num13");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num12");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num11");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num10");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num9");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num8");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num7");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num6");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num5");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num4");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num3");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num2");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num1");
        this.buttons.push(aux);


        //Buttons right
        aux = new MyButton(this.scene, "num19");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num18");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num17");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num16");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num15");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num14");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num13");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num12");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num11");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num10");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num9");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num8");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num7");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num6");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num5");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num4");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num3");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num2");
        this.buttons.push(aux);
        aux = new MyButton(this.scene, "num1");
        this.buttons.push(aux);

        //console.log(this.buttons);
    };

    applyTextures(factorS, factorT){
        
    };
}