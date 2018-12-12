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
    };

    display(){
        //console.log("Hi");
        let i;
        //Buttons top
        for(i = 0; i < 19; i++){
            this.scene.pushMatrix();
            this.scene.translate(1, 0, 0);
            //this.scene.translate(i, 0, 0);
            //this.scene.registerForPick(i+1, this.buttons[i]);
            
            this.buttons[i].display();
            this.scene.popMatrix();
        }
    };    

    createButtons(){
        for(let i = 0; i < 19; i++){
            let aux = new MyButton(this.scene);
            this.buttons.push(aux);
        }
        console.log(this.buttons);
    };

    applyTextures(factorS, factorT){
        
    };
}