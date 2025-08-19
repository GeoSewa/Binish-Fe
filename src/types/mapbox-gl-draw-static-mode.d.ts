declare module '@mapbox/mapbox-gl-draw-static-mode' {
  import { IMode } from '@mapbox/mapbox-gl-draw';
  
  class StaticMode implements IMode {
    constructor(options?: any);
    onSetup(): void;
    onDragStart(): void;
    onDrag(): void;
    onDragEnd(): void;
    onClick(): void;
    onTap(): void;
    onKeyUp(): void;
    onMouseMove(): void;
    onMouseOut(): void;
    onAction(): void;
    onTrash(): void;
    onStop(): void;
    toDisplayFeatures(): void;
  }
  
  export default StaticMode;
}
