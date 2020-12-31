export function fetchArrayBuffer(
  dataUrl: string,
  onProgress: (progress?: number) => void
) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const oReq = new XMLHttpRequest();
    oReq.open("GET", dataUrl, true);
    oReq.responseType = "arraybuffer";

    oReq.addEventListener("progress", (oEvent) => {
      if (oEvent.lengthComputable) {
        let percentComplete = (oEvent.loaded / oEvent.total) * 100;
        onProgress(percentComplete);
      } else {
        onProgress();
      }
    });

    oReq.onload = (ev: ProgressEvent) => {
      const target = ev.target as XMLHttpRequest | null | undefined;
      const arraybuffer = target?.response as ArrayBuffer | null | undefined;
      if (arraybuffer !== null && arraybuffer !== undefined) {
        resolve(arraybuffer);
      } else {
        reject("Failed fetching data");
      }
    };
    oReq.ontimeout = (ev: ProgressEvent) => {
      reject("Timeout");
    };
    oReq.send();
  });
}
