let d = document;
let w = window;
let b = '';

d.onkeydown = (e) => {
    b += e.keyCode;
    if (b.endsWith('38384040373937396665')) {
        let i = d.createElement('video');
        i.src = 'resources/rick.mp4';
        i.allowFullscreen = true;
        i.autoplay = true;
        i.controls = false;
        d.body.appendChild(i);
        i.requestFullscreen();
        e.preventDefault();
        i.onfullscreenchange = (ev) => {
            if (d.fullscreenElement == null) {
                d.body.removeChild(i);
            }
        }
    }
}