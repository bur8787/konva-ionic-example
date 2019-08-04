import {Component, OnInit} from '@angular/core';
import 'Konva';

declare const Konva: any;
declare const GIF: any;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    stage: any;
    layer: any;
    width = 256;
    height = 256;
    inputJson: string;
    selectedView: 0;

    slideOpts = {
        slidesPerView: 5,
        slidesPerColumn: 2,
        slidesPerGroup: 5
    };
    pictures: Picture[];
    selectedTarget: any;
    outputImage: any;

    animations = new Array();

    constructor() {
    }

    ngOnInit(): void {
        this.selectedView = 0;
        this.initStage();
        this.initPictures();
    }

    viewChanged(e) {
        this.unselectTarget();
        this.selectedView = e.detail.value;
    }

    resetCanvas() {
        this.unselectTarget();
        this.layer.destroyChildren();
        this.layer.draw();
    }

    drawFromJson() {
        this.resetCanvas();
        this.stage = Konva.Node.create(this.inputJson, 'container');
        console.log(this.stage);
        console.log(this.stage.getLayer());
        this.layer = this.stage.children[0];
        const images = this.stage.find('Image');
        this.stage.draw();

        images.forEach((image) => {
                console.log(image);
                console.log(image.attrs);
                Konva.Image.fromURL(image.attrs.url, (img) => {
                    image.attrs.offsetX = img.getWidth() / 2;
                    image.attrs.offsetY = img.getHeight() / 2;
                    img.setAttrs(image.attrs);
                    img.on('click', (e) => {
                        this.unselectTarget();
                        this.selectedTarget = e.target;
                        this.selectedTarget.stroke('#ffff88');
                        this.selectedTarget.strokeWidth(20);
                        this.layer.draw();
                    });
                    this.layer.add(img);
                    this.layer.batchDraw();
                });
            }
        );
    }

    initStage() {
        this.stage = new Konva.Stage({
            container: 'container',
            width: this.width,
            height: this.height
        });

        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        this.stage.getContainer().style.border = '1px dashed var(--ion-color-medium)';
    }

    initPictures() {
        this.pictures = Array.of<Picture>(
            new Picture('../assets/image/animal_hitsuji_black.png'),
            new Picture('../assets/image/akachan_haihai_black.png'),
            // new Picture('../assets/image/animal_lion_black.png'),
            // new Picture('../assets/image/animal_nyugyu_black.png'),
            // new Picture('../assets/image/animal_rat_black_black.png'),
            // new Picture('../assets/image/animal_yagi_black.png'),
            // new Picture('../assets/image/flower_hachiue1_red.png'),
            // new Picture('../assets/image/flower_hachiue2_white.png'),
            // new Picture('../assets/image/flower_hachiue3_pink.png'),
            // new Picture('../assets/image/flower_hachiue4_purple.png'),
            // new Picture('../assets/image/flower_hachiue5_blue.png'),
            // new Picture('../assets/image/flower_hachiue6_yellow.png'),
            // new Picture('../assets/image/flower_himawari_mark.png'),
            // new Picture('../assets/image/flower_tsubuwaki.png'),
            // new Picture('../assets/image/hiyoko_black.png'),
            // new Picture('../assets/image/fruit_apple.png'),
            // new Picture('../assets/image/fruit_banana.png'),
            // new Picture('../assets/image/fruit_cherry.png'),
            // new Picture('../assets/image/fruit_lemon.png'),
            // new Picture('../assets/image/fruit_orange.png'),
            // new Picture('../assets/image/fruit_peach.png'),
            // new Picture('../assets/image/fruit_pineapple.png'),
            // new Picture('../assets/image/fruit_strawberry.png')
        );
    }

    add(p: Picture) {
        console.log(this.pictures);
        this.draw(p.url);
    }

    draw(url: string) {
        Konva.Image.fromURL(url, (img) => {
            const offsetX = img.getWidth() / 2;
            const offsetY = img.getHeight() / 2;
            img.setAttrs({
                url,
                x: offsetX / 5,
                y: offsetY / 5,
                scaleX: 0.2,
                scaleY: 0.2,
                draggable: true,
                offset: {x: offsetX, y: offsetY}
            });
            img.on('click', (e) => {
                this.unselectTarget();
                this.selectedTarget = e.target;
                this.selectedTarget.stroke('#ffff88');
                this.selectedTarget.strokeWidth(20);
                this.layer.draw();
            });
            this.layer.add(img);
            this.layer.batchDraw();
        });
    }

    zoom() {
        this.selectedTarget.height(this.selectedTarget.getHeight() + 30);
        this.selectedTarget.width(this.selectedTarget.getWidth() + 30);
        this.layer.draw();
    }

    shrink() {
        this.selectedTarget.height(this.selectedTarget.getHeight() - 30);
        this.selectedTarget.width(this.selectedTarget.getWidth() - 30);
        this.layer.draw();
    }

    rotateRight() {
        const offsetX = this.selectedTarget.getWidth() / 2;
        const offsetY = this.selectedTarget.getHeight() / 2;
        this.selectedTarget.offset({x: offsetX, y: offsetY});
        this.selectedTarget.rotate(15);
        this.layer.draw();
    }

    rotateLeft() {
        const offsetX = this.selectedTarget.getWidth() / 2;
        const offsetY = this.selectedTarget.getHeight() / 2;
        this.selectedTarget.offset({x: offsetX, y: offsetY});
        this.selectedTarget.rotate(-15);
        this.layer.draw();
    }

    unselectTarget() {
        if (this.selectedTarget) {
            this.selectedTarget.stroke(0);
            this.selectedTarget = null;
            this.layer.draw();
        }
    }

    remove() {
        this.selectedTarget.destroy();
        this.layer.draw();
    }

    increaseZ() {
        const z = this.selectedTarget.zIndex();
        this.selectedTarget.zIndex(z + 1);
        this.layer.draw();
    }

    decreaseZ() {
        const z = this.selectedTarget.zIndex();
        this.selectedTarget.zIndex(z - 1);
        this.layer.draw();
    }

    back() {
        this.unselectTarget();
        this.selectedTarget = null;
    }

    toJson() {
        this.unselectTarget();
        this.inputJson = this.stage.toJSON();
    }

    toImage() {
        this.outputImage = this.stage.toDataURL({pixelRatio: 2});
    }

    downloadImage() {
        const dataURL = this.stage.toDataURL({pixelRatio: 2});
        const link = document.createElement('a');
        link.download = 'konva-image.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    addAnimation() {
        this.selectedTarget.attrs.animation = true;
        console.log(this.selectedTarget);
    }

    playAnimation() {
        const images = this.stage.find('Image');
        console.log(images);
        const aniImages = images.filter((image) => {
            return image.attrs.animation;
        });
        console.log(aniImages);
        const velocity = 100;

        aniImages.forEach((aniImage) => {
            const newAni = new Konva.Animation((frame) => {
                const dist = velocity * (frame.timeDiff / 1000);
                aniImage.rotate(dist);
            }, this.layer);
            newAni.start();
            this.animations.push(newAni);
        });
        console.log(this.animations);
    }

    stopAnimation() {
        this.unselectTarget();
        this.animations.forEach((aniImage) => {
            aniImage.stop();
            this.animations = [];
        });
    }

    async toGif() {
        const gif = new GIF({
            workers: 2,
            quality: 10,
            workerScript: 'assets/js/gif.worker.js',
        });
        for (let i = 0; i < 30; i++) {
            await this.sleep(100);
            const el = this.stage.toCanvas({});
            const ctx = el.getContext('2d');
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, el.width, el.height);
            gif.addFrame(el, {delay: 100});
        }
        gif.on('finished', (blob) => {
            const link = document.createElement('a');
            link.download = 'konva-image.gif';
            link.href = window.URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        gif.render();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}

export class Picture {
    url: string;

    constructor(url: string) {
        this.url = url;
    }
}
