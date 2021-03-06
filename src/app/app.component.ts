import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {InterfaceService} from './interface.service';
import * as THREE from 'three';
import {mapNumber} from '../assets/functions/mapNumber';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  kitty: boolean;
  clock: boolean;
  three: boolean;
  compete: boolean;
  clouds: boolean;
  maxusers: number;


  @ViewChild('container') elementRef: ElementRef;
  private container: HTMLElement;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  private cube: THREE.Mesh;

  devices: Array<string>;

  onEnter(value: string) { this.maxusers = parseInt(value, 10); }

  constructor(private interfaceService: InterfaceService) {
    this.maxusers = 1;
    this.devices = [];
  }

  ngOnInit() {

    this.container = this.elementRef.nativeElement;

    console.log(this.container);

    this.init();
    this.kitty = false;
    this.clouds = true;
    this.three = false;

    this.interfaceService.messages.subscribe(msg => {
      console.log(this.devices.length, this.maxusers);

      /**
       * Here, I want to add the first 10 devices in an array.
       * Then, only these devices will be allowed to affect the UI.
       *
       * First off, I am checking how many active users I have, and if the
       * number of active users is less than the max allowed.
       * Initially I have zero active users.
       *
       * So, if the uuid of the device is not already in our device array,
       * then I am adding it.
       * Also, I am augmenting the number of active users.
       *
       * Now, another user comes along.
       *
       * HOW ARE THEY EVEN getting added to the array!!!
       *
       * */

      if (this.devices.length < this.maxusers) {
        if (!this.devices.includes(msg.text.uuid)) {
          this.devices.push(msg.text.uuid);
        }
      }

      console.log('my msg', this.devices);
      if (this.devices.includes(msg.text.uuid)) {

        if (msg.text.type === 'motion') {
          document.getElementById('x').innerHTML = Math.round(msg.text.x).toString();
          document.getElementById('y').innerHTML = Math.round(msg.text.y).toString();
          document.getElementById('z').innerHTML = Math.round(msg.text.z).toString();
          this.animate(Math.round(msg.text.x), Math.round(msg.text.y), Math.round(msg.text.z));
        }

        if (msg.text.type === 'orientation') {
          document.getElementById('alpha').innerHTML = Math.round(msg.text.alpha).toString();
          document.getElementById('beta').innerHTML = Math.round(msg.text.beta).toString();
          document.getElementById('gamma').innerHTML = Math.round(msg.text.gamma).toString();
          this.move(Math.round(msg.text.beta), Math.round(msg.text.gamma), Math.round(msg.text.alpha));
        }

        if (msg.text.type === 'light') {
          document.getElementById('light').innerHTML = Math.round(msg.text.light).toString();
          this.darken(Math.round(msg.text.light));
        }

        if (msg.text.type === 'proximity') {
          document.getElementById('prox_max').innerHTML = Math.round(msg.text.proximity.max).toString();
          document.getElementById('prox_min').innerHTML = Math.round(msg.text.proximity.min).toString();
          document.getElementById('prox').innerHTML = Math.round(msg.text.proximity.value).toString();
        }

        if (msg.text.type ===  'logout') {
          console.log('logged out');
          console.log(this.devices.indexOf(msg.text.uuid));
          this.devices.splice(this.devices.indexOf(msg.text.uuid), 1 );
          console.log(this.devices);
        }
      }

    });
  }

  init() {
    let screen = {
        width: 500,
        height: 500
      },
      view = {
        angle: 45,
        aspect: screen.width / screen.height,
        near: 0.1,
        far: 1000
      };

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(view.angle, view.aspect, view.near, view.far);
    this.renderer = new THREE.WebGLRenderer();

    this.scene.add(this.camera);
    this.scene.add(new THREE.AxisHelper(20));

    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.renderer.setSize(screen.width, screen.height);
    this.container.appendChild(this.renderer.domElement);


    let geometry = new THREE.BoxGeometry(5, 5, 5),
      material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});

    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(-50, -50, -50);

    this.scene.add(this.cube);

    this.render();
  }

  render() {

    let self: AppComponent = this;

    (function render() {
      requestAnimationFrame(render);
      self.renderer.render(self.scene, self.camera);
    }());

  }

  animate(x, y, z) {
    this.cube.rotateX(x / 100);
    this.cube.rotateY(y / 100);
    this.cube.position.addScalar(z / 100);
    if (this.compete) {
      let current = parseInt(document.getElementById('cat').getAttribute('x'));
      if ((current + y >= 0) && (current + y <= 1080)) {
        document.getElementById('cat').setAttribute('x', (current + y / 10).toString());
      } else {
        document.getElementById('cat').setAttribute('x', (current).toString());
      }
    }
  }

  move(b, g, a) {
    console.log('point');
    if (this.kitty) {
      document.getElementById('cat').setAttribute('x', (1080 - a * 3).toString());
    }
    if (this.clock) {
      document.getElementById('clockhand').setAttribute('transform', `rotate(${360 - a} 300 300)`);
    }
  }

  darken(light) {
    if (this.clouds) {
      document.getElementById('cloud-1').setAttribute('transform', `translate(${light})`);
      document.getElementById('cloud-2').setAttribute('transform', `translate(${light})`);
      document.getElementById('cloud-3').setAttribute('transform', `translate(${light})`);
      document.getElementById('cloud-4').setAttribute('transform', `translate(${light})`);
      document.getElementById('cloud-5').setAttribute('transform', `translate(${light})`);
      document.getElementById('cloud-6').setAttribute('transform', `translate(${light})`);
      if (light <= 500) {
        let color = Math.round(mapNumber(light, 20, 500, 80, 200));
        document.getElementById('sky').setAttribute('style', `fill: rgb(${color}, ${color}, ${color})`);
      } else {
        document.getElementById('sky').setAttribute('style', 'fill: #9dceff');
      }
    }
  }

  showAnimation(elem) {
    if (elem === 'kitty') {
      this.kitty = true;
      this.clock = false;
      this.three = false;
      this.compete = false;
      this.clouds = false;
    }
    if (elem === 'clock') {
      this.kitty = false;
      this.clock = true;
      this.three = false;
      this.compete = false;
      this.clouds = false;
    }
    if (elem === 'cube') {
      this.kitty = false;
      this.clock = false;
      this.three = true;
      this.compete = false;
      this.clouds = false;
    }
    if (elem === 'compete') {
      this.kitty = false;
      this.clock = false;
      this.three = false;
      this.compete = true;
      this.clouds = false;
    }
    if (elem === 'clouds') {
      this.kitty = false;
      this.clock = false;
      this.three = false;
      this.compete = false;
      this.clouds = true;
    }
  }

}
