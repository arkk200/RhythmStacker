const urlBtn = document.querySelector('.url-button');
const form = document.querySelector('.document');
const iframe = document.querySelector('iframe');

urlBtn.addEventListener('click', getYoutubeVideo);
form.addEventListener('submit', onSubmit);


function getYoutubeVideo() {
    let url = document.querySelector('.link-input').value;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length == 11) {
        iframe.src = `https://www.youtube-nocookie.com/embed/${match[2]}`;
    } 
}

function onSubmit(e) {
    e.preventDefault();
}