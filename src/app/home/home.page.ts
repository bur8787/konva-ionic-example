import {Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {KonvaComponent} from 'ng2-konva';
import {Image} from 'konva/types/shapes/Image';

interface Window {
    Image: any;
    innerWidth: any;
    innerHeight: any;
}

declare const window: Window;
declare const Konva: any;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
    @ViewChild('stage', {static: true}) stage: KonvaComponent;
    @ViewChild('layer', {static: true}) layer: KonvaComponent;
    @ViewChild('dragLayer', {static: true}) dragLayer: KonvaComponent;

    public list: Array<any> = [];
    public configImage: EventEmitter<any> = new EventEmitter();

    public width = window.innerWidth;
    public height = window.innerHeight;

    public configStage: Observable<any> = of({
        width: this.width,
        height: this.height
    });

    public ngOnInit() {
        for (let n = 0; n < 50; n++) {
            const scale = Math.random();
            const image = this.createImage('../assets/icon/favicon.png');
            this.list.push(
                new BehaviorSubject({
                    x: Math.random() * this.width,
                    y: Math.random() * this.height,
                    width: 64,
                    height: 64,
                    draggable: true,
                    image,
                    rotation: Math.random() * 180,
                    numPoints: 5,
                    innerRadius: 30,
                    outerRadius: 50,
                    opacity: 0.8,
                    scaleX: scale,
                    scaleY: scale,
                    shadowColor: 'black',
                    shadowBlur: 10,
                    shadowOffsetX: 5,
                    shadowOffsetY: 5,
                    shadowOpacity: 0.6,
                    startScale: scale
                })
            );
        }
    }

    public handleDragstart(ngComponent: KonvaComponent) {
        const shape = ngComponent.getStage();
        const dragLayer = this.dragLayer.getStage();
        const stage = this.stage.getStage();

        // moving to another layer will improve dragging performance
        shape.moveTo(dragLayer);
        stage.draw();

        shape.to({
            shadowOffsetX: 15,
            shadowOffsetY: 15,
            scaleX: ngComponent.getConfig().startScale * 1.2,
            scaleY: ngComponent.getConfig().startScale * 1.2
        });
    }

    public handleDragend(ngComponent: KonvaComponent) {
        const shape = ngComponent.getStage();
        const layer = this.layer.getStage();
        const stage = this.stage.getStage();

        shape.moveTo(layer);
        stage.draw();
        shape.to({
            duration: 0.5,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: ngComponent.getConfig().startScale,
            scaleY: ngComponent.getConfig().startScale,
            shadowOffsetX: 5,
            shadowOffsetY: 5
        });
    }

    createImage(src: string): Image {
        const image = new window.Image();
        image.src = src;
        image.onload = () => {
            this.configImage.emit({
                image
            });
        };
        return image;
    }

}

