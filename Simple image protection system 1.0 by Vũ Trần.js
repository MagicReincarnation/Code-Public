// **** Simple image protection system 1.0 by Vũ Trần **** //
HTML:
<div id='canvas-chapter'/>

CSS:
  .canvas-wrapper {margin: 0 auto}
  .canvas-wrapper canvas {width: 100%;pointer-events: none!important}
   canvas{image-rendering: optimizeQuality;image-rendering: -moz-crisp-edges;image-rendering: -webkit-optimize-contrast;image-rendering: optimize-contrast;-ms-interpolation-mode: nearest-neighbor}


JS:
1.
<script defer='defer' type='text/javascript'>
window.addEventListener(`load`, function () {
  const imgTags = `<data:post.body.cssEscaped/>`;
  ImageManager.loadImages(imgTags);
});
</script>
2.
<script defer='defer' type='text/javascript'>
const ImageManager = (function () {
  let currentLoadTask = null;

  const getModifiedSrc = (imgTag) => {
    const srcRegex = /src=(["'])(.*?)\1/;
    const match = imgTag.match(srcRegex);
    if (match) {
      let src = match[2];
      src = src.replace(/s1600/, "s1600-rw");
      src = src.replace(/s1600-rw\/.*/, "s1600-rw/M.webp");
      const domains = ['i0.wp.com', 'i1.wp.com', 'i2.wp.com', 'i3.wp.com'];
      const randomDomain = domains[Math.floor(Math.random() * domains.length)];
      const modifiedSrc = src.replace(/https?:\/\//, `https://${randomDomain}/`);
      return modifiedSrc;
    }
    return null;
  };

  const loadNextImageAsync = async (imgTagsArray, index, canvasContainer) => {
    if (index >= imgTagsArray.length) {
      return;
    }

    const imgTag = imgTagsArray[index];
    const src = getModifiedSrc(imgTag);

    if (src) {
      const image = new Image();
      const canvasWrapper = document.createElement("div");
      canvasWrapper.className = "canvas-wrapper";

      const canvas = document.createElement("canvas");
      canvasWrapper.appendChild(canvas);
      canvasContainer.appendChild(canvasWrapper);

      image.onload = function () {
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        canvasWrapper.style.maxWidth = `${image.width}px`;
        canvasWrapper.style.maxHeight = `${image.height}px`;
      };

      image.src = src;
    }

    setTimeout(() => {
      loadNextImageAsync(imgTagsArray, index + 1, canvasContainer);
    }, 300);
  };

  return {
    loadImages: function (imgTags) {
      if (currentLoadTask) {
        clearTimeout(currentLoadTask);
      }

      const imgTagsArray = imgTags.match(/<img[^>]+>/g);
      const canvasContainer = document.getElementById("canvas-chapter");

      currentLoadTask = setTimeout(() => {
        currentLoadTask = null;
        loadNextImageAsync(imgTagsArray, 0, canvasContainer);
      }, 300);
    },

    cancelImageLoad: function () {
      if (currentLoadTask) {
        clearTimeout(currentLoadTask);
        currentLoadTask = null;
      }
    },
  };
})();
</script>
3.
<script defer disable-devtool-auto='' src='https://cdn.jsdelivr.net/npm/disable-devtool'/> 
(>> https://github.com/theajack/disable-devtool <<)
