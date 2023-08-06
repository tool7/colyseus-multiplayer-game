class CameraState {
  private static _zoomLevel = 1;

  static get zoomLevel() {
    return this._zoomLevel;
  }

  static setZoomLevel(level: number) {
    this._zoomLevel = level;
  }
}

export default CameraState;
