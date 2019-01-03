class InterfaceComponent {

    constructor(scene, vertices, text_coords, indices, texture_path, on_click) {
      this.scene = scene;
      this.vertices = vertices;
      this.text_coords = text_coords;
      this.indices = indices;
      if (texture_path != null)
          this.texture = new CGFtexture(this.scene, "./scenes/images/interface/" + texture_path);
      else this.texture = null;
      this.on_click = on_click;
      this.init();
    }
  
    init() {
      let gl = this.scene.gl;
  
      this.vertsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
  
      this.indicesBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
  
      this.texCoordsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.text_coords), gl.STATIC_DRAW);
  
      this.indicesBuffer.numValues = this.indices.length;
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
  
    render() {
      let shader = this.scene.activeShader;
      let gl = this.scene.gl;

      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.enableVertexAttribArray(shader.attributes.aVertexPosition);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertsBuffer);
      gl.vertexAttribPointer(shader.attributes.aVertexPosition, 2, gl.FLOAT, false, 0, 0);
  
      gl.enableVertexAttribArray(shader.attributes.aTextureCoord);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuffer);
      gl.vertexAttribPointer(shader.attributes.aTextureCoord, 2, gl.FLOAT, false, 0, 0);
  
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
      if (this.texture != null)
        this.texture.bind();
      gl.drawElements(this.scene.gl.TRIANGLES, this.indicesBuffer.numValues, gl.UNSIGNED_SHORT, 0);
      
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      if (this.texture != null)
         this.texture.unbind();
    }
  
    onClick() {
        if (this.on_click)
            this.on_click();
    }
  
    isInside(x, y, canvas_width, canvas_height) {
        let top = (-this.vertices[1] + 1) / 2 * canvas_height;
        let bottom = (-this.vertices[5] + 1) / 2 * canvas_height;
        let left = (this.vertices[0] + 1) / 2 * canvas_width;
        let right = (this.vertices[2] + 1) / 2 * canvas_width;
        let height = Math.abs(bottom - top);
        let width = Math.abs(right - left);
        return y >= top && y <= top + height && x >= left && x <= left + width;
    }
  }