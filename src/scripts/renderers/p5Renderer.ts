import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';
import gsap from 'gsap';
import P5 from 'p5';

const srandom = seedrandom('b');


let c01 = (g: number, s) => {
    return s.constrain(g, 0, 1);
}

let ease = (p, s) => {
    p = c01(p, s);
    return 3*p*p - 2*p*p*p;
  }

export default class P5Renderer implements BaseRenderer{

    recording: boolean = false;
    colors = ['#D1CDC4', '#340352', '#732A70', '#FF6EA7', '#FFE15F'];
    backgroundColor = '#340352';

    canvas: HTMLCanvasElement;
    s: any;

    completeCallback: any;
    delta = 0;
    animating = true;

    width: number = 1920 / 2;
    height: number = 1080 / 2;

    size: number;

    x: number;
    y: number;

    frameCount = 0;
    totalFrames = 1000;

    constructor(w, h) {

        this.width = w;
        this.height = h;

        const sketch = (s) => {
            this.s = s;
            s.pixelDensity(1);
            s.setup = () => this.setup(s)
            s.draw = () => this.draw(s)
        }

        new P5(sketch);
    }

    protected setup(s) {
        let renderer = s.createCanvas(this.width, this.height, s.WEBGL);
        this.canvas = renderer.canvas;
        //s.background(0, 0, 0, 255);
        //s.colorMode(s.HSB);

        s.smooth(8);  
        s.rectMode(s.CENTER);
        s.pixelDensity(1);
        s.fill(32);
        //s.ortho();
        s.noStroke();


    }

    protected draw(s) {
        if (this.animating) { 
            this.frameCount += 3;

            let frameDelta = 2 * Math.PI * (this.frameCount % this.totalFrames) / this.totalFrames;

            s.background(s.color(this.backgroundColor));
            s.push();

            let numpoints = 100;

            let L = 16;

            let x = 0;
            let y = 0;
            let z = 0;

            s.scale(.75);
            s.translate(-75, -75)
            //s.rotateY(-s.QUARTER_PI);

            for (let i = 0; i < 10; i++) {

                z = i*L;
                s.push();
                s.translate(0, 0, z);

                for (let j = 0; j < 10; j++) {
                    for (let k = 0; k < 10; k++) {

                        let noiseAmt = 1.1;
                        let noiseScale = 0.005;
                        let noise = (frameDelta + 2*noiseAmt - noiseAmt*s.noise(noiseScale*x+123, noiseScale*y+234, noiseScale*z+345))%1;

                        let remap = (s.map(noise, .25, 1, 0, 1));
                        let e = L*(1-ease(remap, s));

                        //e = ease(4*noise, s);

                        x = (j+.5)*L;
                        y = (k+.5)*L;

                        let color1 = s.color(this.colors[2]);
                        let color2 = s.color(this.colors[4]);
                        color1.setAlpha(250);
                        color2.setAlpha(200);

                        let color = s.lerpColor(color1, color2, ease(remap, s));
                        s.fill(color);

                        s.push();
                        s.translate(x, y + 0);
                        s.box(e);
                        s.pop();
                    }
                }

                s.pop();
            }

            if (this.recording) {
                if (frameDelta == 0) {
                    this.completeCallback();
                }
            }
        }
    }

    protected getPolar = function(x, y, r, a) {
        // Get as radians
        var fa = a * (Math.PI / 180);
        
        // Convert coordinates
        var dx = r * Math.cos(fa);
        var dy = r * Math.sin(fa);
        
        // Add origin values (not necessary)
        var fx = x + dx;
        var fy = y + dy;
    
        return [fx, fy];
    }
    

    public render() {

    }

    public play() {
        this.frameCount = 0;
        this.recording = true;
        this.animating = true;
        this.s.background(0, 0, 0, 255);
    }

    public stop() {
        this.animating = false;
    }

    public setCompleteCallback(completeCallback: any) {
        this.completeCallback = completeCallback;
    }

    public resize() {
        this.s.resizeCanvas(window.innerWidth, window.innerHeight);
        this.s.background(0, 0, 0, 255);
    }
}