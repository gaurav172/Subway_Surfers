/// <reference path="webgl.d.ts" />

let coin = class {
    constructor(gl, pos, path) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        this.positions = [];
        this.positions.push(0);
        this.positions.push(0);
        this.positions.push(0);
        this.rad = 0.5;
        // var Pii =th Math.Pi;
        // console.log(Pii);
        // Pii=Pii*2;
        var Pi=3.1415;
        var n = 50.00;
        for(var i=0;i<50;i++)
        {
            this.positions.push(this.rad*Math.cos((2*i*Pi)/n));
            this.positions.push(this.rad*Math.sin((i*2*Pi)/n));
            this.positions.push(0);
        }
        // console.log(this.positions);
        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);


		  const textureCoordBuffer = gl.createBuffer();
		  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

        var textureCoordinates = [];
        for(var i=0;i<=50;i++)
        {
            textureCoordinates.push(0.5);
            textureCoordinates.push(0.5);
            // textureCoordinates.push(0);
            // textureCoordinates.push(1);
            // textureCoordinates.push(1);
            // textureCoordinates.push(0);
            // textureCoordinates.push(1);
            // textureCoordinates.push(1);
        }
        // console.log(textureCoordinates);
		  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
		                gl.STATIC_DRAW);

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        // This array defines each face as two triangles, using the
        // indices into the vertex array to specify each triangle's
        // position.

        var indices = [];
        for(var i=1;i<=50;i++)
        {
            indices.push(0);
            indices.push(i);
            if(i!=50)
                indices.push(i+1);
            else
                indices.push(1);
        }
        // console.log(indices);
        // Now send the element array to GL

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices), gl.STATIC_DRAW);

        this.buffer = {
            position: this.positionBuffer,
		    textureCoord: textureCoordBuffer,
            indices: indexBuffer,
        }
        this.texture = loadTexture(gl,path);

    }

    drawCube(gl, projectionMatrix, programInfo, deltaTime) {
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
        );
        
        //this.rotation += Math.PI / (((Math.random()) % 100) + 50);

        this.scalemat = [1,1,2];

        mat4.scale(modelViewMatrix,
            modelViewMatrix,
            this.scalemat);

        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [1, 0, 0]);

        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        // tell webgl how to pull out the texture coordinates from buffer
		{
		    const num = 2; // every coordinate composed of 2 values
		    const type = gl.FLOAT; // the data in the buffer is 32 bit float
		    const normalize = false; // don't normalize
		    const stride = 0; // how many` bytes to get from one set to the next
		    const offset = 0; // how many bytes inside the buffer to start from
		    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
		    gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
		    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
		}

        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // Tell WebGL to use our program when drawing

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        // Tell WebGL we want to affect texture unit 0
		  gl.activeTexture(gl.TEXTURE0);

		  // Bind the texture to texture unit 0
		  gl.bindTexture(gl.TEXTURE_2D, this.texture);

		  // Tell the shader we bound the texture to texture unit 0
		  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

        {
            const vertexCount = 50*3;
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

    }
};