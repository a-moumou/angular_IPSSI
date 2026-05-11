import { Component } from '@angular/core';
import { Hello } from './hello/hello';

@Component({
  selector: 'app-root',
  imports: [Hello],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
